const BlogPost = require('../models/blogModel');
const path = require('path');
const fs = require('fs');

// Create a new blog post with optional image upload
exports.createBlogPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    let imagePath;

    // Handle uploaded image
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newBlog = new BlogPost({
      title,
      content,
      tags,
      author: req.user._id,
      image: imagePath,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog post created', blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blog posts with optional filtering by tags
exports.getAllBlogPosts = async (req, res) => {
  try {
    const { tags } = req.query;
    const filter = {};
    if (tags) filter.tags = { $in: tags.split(',') }; // Filter by tags

    const blogs = await BlogPost.find(filter).populate('author', 'name email');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog post
exports.updateBlogPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    // Ensure only the author can update the post
    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized action' });

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = tags;

    blog.updatedAt = Date.now();
    await blog.save();

    res.status(200).json({ message: 'Blog post updated', blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    // Ensure only the author can delete the post
    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized action' });

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search blog posts by keywords
exports.searchBlogPosts = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ message: 'Keyword is required' });

    const blogs = await BlogPost.find({
      $text: { $search: keyword },
    }).populate('author', 'name email');

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

