import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

export function getBucketName(): string | undefined {
  return process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET;
}

function isAwsConfigured(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      getBucketName()
  );
}

let cachedClient: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!isAwsConfigured()) {
    throw new Error(
      'AWS S3 is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_BUCKET_NAME (or AWS_S3_BUCKET).'
    );
  }

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true,
      endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
    });
    logger.info('AWS S3 client initialized');
  }

  return cachedClient;
}

export function isS3Enabled(): boolean {
  return isAwsConfigured();
}

/** @deprecated Use getS3Client() — lazy initialization */
export const s3Client = new Proxy({} as S3Client, {
  get(_target, prop) {
    return (getS3Client() as any)[prop];
  },
});

/** @deprecated Use getBucketName() */
export const bucketName = getBucketName();
