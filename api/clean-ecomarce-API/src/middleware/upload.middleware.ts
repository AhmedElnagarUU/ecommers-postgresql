import { Request } from 'express';
import multer from 'multer';
import { s3Client, bucketName } from '../config/s3.config';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Function to validate file type
const validateFileType = (mimeType: string): boolean => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedMimeTypes.includes(mimeType);
};

// Multer file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (validateFileType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Function to generate a unique file name
const generateUniqueFileName = (originalName: string): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const extension = originalName.split('.').pop();
  return `${uniqueSuffix}.${extension}`;
};

// Function to upload a single buffer to S3
export const uploadToS3 = async (
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string = 'products'
): Promise<string> => {
  if (!validateFileType(mimeType)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
  }

  const fileName = generateUniqueFileName(originalName);
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  try {
    await s3Client.send(command);
    return key;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image to S3');
  }
};

// Function to get a signed URL for an uploaded file
export const getSignedFileUrl = async (key: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    const url = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // URL expires in 1 hour
    });
    
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
};

// Middleware to handle S3 upload for product images
export const handleProductImageUpload = async (req: Request, res: any, next: any) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return next();
    }

    const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
      try {
        const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        const url = await getSignedFileUrl(key);
        return { key, url };
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
        throw error;
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Add the image keys to the request body
    req.body.images = uploadedFiles.map(file => file.key);
    next();
  } catch (error) {
    console.error('Error in handleProductImageUpload:', error);
    next(error);
  }
};

// Function to delete a file from S3
export const deleteFromS3 = async (key: string, retryCount = 3): Promise<boolean> => {
  let attempts = 0;
  while (attempts < retryCount) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      
      await s3Client.send(command);
      return true; // Successful deletion
    } catch (error: any) {
      attempts++;
      const isRetryable = error.name === 'NetworkingError' || 
                          error.name === 'TimeoutError' ||
                          error.$metadata?.httpStatusCode >= 500;
      
      console.error(`Error deleting file from S3 (attempt ${attempts}/${retryCount}):`, 
                   key, error.name, error.message);
      
      // If not a retryable error or we've used all retries, throw the error
      if (!isRetryable || attempts >= retryCount) {
        if (error.name === 'NoSuchKey') {
          console.warn(`File ${key} does not exist in S3 bucket, considering it already deleted`);
          return true; // Consider it a success if it doesn't exist
        }
        return false; // Failed to delete after retries
      }
      
      // Wait before retrying with exponential backoff
      const delay = Math.pow(2, attempts) * 500; // 500ms, 1s, 2s, ...
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false; // Failed to delete after retries
};

// Function to delete multiple files from S3
export const deleteMultipleFromS3 = async (keys: string[]): Promise<{
  success: boolean,
  deletedKeys: string[],
  failedKeys: string[]
}> => {
  if (!keys || keys.length === 0) {
    return { success: true, deletedKeys: [], failedKeys: [] };
  }
  
  const deletedKeys: string[] = [];
  const failedKeys: string[] = [];
  
  try {
    // Process deletion in batches to avoid overwhelming S3
    const BATCH_SIZE = 20;
    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batch = keys.slice(i, i + BATCH_SIZE);
      
      // Process each key in the batch
      const results = await Promise.allSettled(
        batch.map(key => deleteFromS3(key))
      );
      
      // Track successful and failed deletions
      results.forEach((result, index) => {
        const key = batch[index];
        if (result.status === 'fulfilled' && result.value === true) {
          deletedKeys.push(key);
        } else {
          failedKeys.push(key);
        }
      });
    }
    
    // Report partial success
    if (failedKeys.length > 0) {
      console.warn(`Partial S3 deletion: ${deletedKeys.length} succeeded, ${failedKeys.length} failed`);
      return { 
        success: false, 
        deletedKeys,
        failedKeys
      };
    }
    
    // All succeeded
    return { 
      success: true,
      deletedKeys,
      failedKeys: []
    };
  } catch (error) {
    console.error('Error in batch deletion from S3:', error);
    return { 
      success: false,
      deletedKeys,
      failedKeys: keys.filter(key => !deletedKeys.includes(key))
    };
  }
};

// Example usage in a route handler:
/*
import { Request, Response } from 'express';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const key = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const url = await getSignedFileUrl(key);
    res.json({ key, url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const files = req.files.map(file => ({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype
    }));

    const keys = await uploadMultipleToS3(files);
    const urls = await Promise.all(keys.map(key => getSignedFileUrl(key)));

    res.json({ keys, urls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/ 