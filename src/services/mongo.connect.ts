import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoOptions: mongoose.ConnectOptions = {
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

export async function connectDB(): Promise<typeof mongoose> {
  const mongoURL = process.env.MONGO_URL as string; // Ensure mongoURL is a string

  try {
    const conn = await mongoose.connect(mongoURL, mongoOptions)
    console.log("database connected");
    return conn;
  } catch (err) {
    console.error("error during mongo connection", err);
    throw err; // Re-throw the error for proper handling
  }
}
