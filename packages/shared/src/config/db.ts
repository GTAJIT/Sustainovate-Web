import mongoose from 'mongoose';
import './dotenv-loader.js';

const mongoUrl =
  process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/sustainovate';

export async function connectDB() {
  try {
    if (mongoUrl.startsWith('mongodb://') || mongoUrl.startsWith('mongodb+srv://')) {
      await mongoose.connect(mongoUrl); // ✅ no extra options needed in v7+
      console.log('MongoDB connected - ✅');
    } else {
      console.warn('No valid MongoDB URI found, skipping database connection');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
