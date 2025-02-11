const express = require('express');
const Blog = require('../models/Blog');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ 1. Create a Blog Post (Only Authenticated Users)
router.post('/create', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    try {
        const blog = new Blog({
            title,
            content,
            author: req.user.id // Getting user ID from JWT token
        });

        await blog.save();
        res.status(201).json({ message: 'Blog post created successfully!', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 2. Get All Blog Posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name email');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 3. Get a Single Blog Post by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found!' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 4. Update a Blog Post (Only Author Can Edit)
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found!' });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied! You are not the author.' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.updatedAt = Date.now();

        await blog.save();
        res.json({ message: 'Blog post updated successfully!', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 5. Delete a Blog Post (Only Author Can Delete)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found!' });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied! You are not the author.' });
        }

        await blog.deleteOne();
        res.json({ message: 'Blog post deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
