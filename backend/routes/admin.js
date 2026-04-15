import express from 'express';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await admin.verifyPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create initial admin (this should be removed or protected in production)
router.post('/setup', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ username, password, email });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;