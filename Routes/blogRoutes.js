const express = require('express');
const { body } = require('express-validator');
const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  searchBlogPosts
} = require('../controller/blogController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validators');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();


// Create a new blog post
router.post(
  '/',
  protect,
  upload.single('image'), // Add middleware for single file upload
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  createBlogPost
);

// Get all blog posts with optional filtering by tags
router.get('/', getAllBlogPosts);

// Get a specific blog post by ID
router.get('/:id', getBlogPostById);

router.get('/search', searchBlogPosts);
// Update a blog post
router.put(
  '/:id',
  protect,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  validateRequest,
  updateBlogPost
);

// Delete a blog post
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;
