const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String], // Array of strings
    required: false, // Tags are optional
  },
  comments: [{
    body: {
      type: String,
      required: true,
    },
    user: {
      type: String, // You can store the username or email of the user who posted the comment
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }]
});

module.exports = mongoose.model('Blog', blogSchema);
