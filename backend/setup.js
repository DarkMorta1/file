import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('akshyata#', 12);
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com'
    });

    await admin.save();
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();