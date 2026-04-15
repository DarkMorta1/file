import express from 'express';
import Gallery from '../models/Gallery.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads/gallery',
  filename: (req, file, cb) => {
    cb(null, `gallery-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gallery item (protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, caption } = req.body;
    const item = new Gallery({
      title,
      caption,
      image: `/uploads/gallery/${req.file.filename}`
    });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update gallery item (protected)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, caption } = req.body;
    const updateData = { title, caption };
    if (req.file) {
      updateData.image = `/uploads/gallery/${req.file.filename}`;
    }
    
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gallery item (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;