import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin'
}

export interface IAdmin extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date;
  permissions: string[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters'],
  },
  role: {
    type: String,
    enum: Object.values(AdminRole),
    required: [true, 'Please specify admin role'],
    default: AdminRole.ADMIN
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  permissions: [{
    type: String,
    required: true
  }],
  refreshToken: {
    type: String,
    select: false,
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ role: 1 });

export const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);
