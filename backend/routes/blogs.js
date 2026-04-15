import express from 'express';
import Blog from '../models/Blog.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads/blogs',
  filename: (req, file, cb) => {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog (protected)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const blog = new Blog({
      title,
      content,
      excerpt,
      image: `/uploads/blogs/${req.file.filename}`
    });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update blog (protected)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const updateData = { title, content, excerpt, updatedAt: Date.now() };
    if (req.file) {
      updateData.image = `/uploads/blogs/${req.file.filename}`;
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete blog (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;