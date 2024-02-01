import { Schema, Document } from 'mongoose';

export interface IEmployee {
  employeeId: string;
  name: string;
  companyName: string;
}

export const employeeSchema = new Schema<IEmployee & Document>({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  }
});
