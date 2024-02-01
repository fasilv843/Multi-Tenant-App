import { Schema, Document } from 'mongoose';

export interface ITenant {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export const tenantSchema = new Schema<ITenant & Document>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Normalize email addresses for consistency
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
  }
});
