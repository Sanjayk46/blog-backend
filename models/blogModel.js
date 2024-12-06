const mongoose = require('mongoose');

// BlogPost Schema
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] }, // Array of tags
  image: { type: String, default: null }, // Path to uploaded image
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Enable text index for search
blogPostSchema.index({ title: 'text', content: 'text' });

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blogPost: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create models
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Export models
module.exports = { BlogPost, Comment };
