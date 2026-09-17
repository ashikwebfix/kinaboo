const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a blog
router.post('/', async (req, res) => {
  try {
    const { title, slug, image, content, linkedProductIds, author, status } = req.body;
    const existingBlog = await Blog.findOne({ where: { slug } });
    if (existingBlog) {
      return res.status(400).json({ message: 'Blog with this slug already exists' });
    }

    const blog = await Blog.create({
      title,
      slug,
      image,
      content,
      linkedProductIds: linkedProductIds || [],
      author: author || 'Admin',
      status: status || 'published'
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a blog
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const { title, slug, image, content, linkedProductIds, author, status } = req.body;
    
    // Check slug uniqueness
    if (slug && slug !== blog.slug) {
      const existing = await Blog.findOne({ where: { slug } });
      if (existing) {
        return res.status(400).json({ message: 'Blog with this slug already exists' });
      }
    }

    await blog.update({
      title: title !== undefined ? title : blog.title,
      slug: slug !== undefined ? slug : blog.slug,
      image: image !== undefined ? image : blog.image,
      content: content !== undefined ? content : blog.content,
      linkedProductIds: linkedProductIds !== undefined ? linkedProductIds : blog.linkedProductIds,
      author: author !== undefined ? author : blog.author,
      status: status !== undefined ? status : blog.status
    });

    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.destroy();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
