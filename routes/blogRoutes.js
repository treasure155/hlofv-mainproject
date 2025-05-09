const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const blogController = require('../controllers/blogController');

// Admin routes
router.get('/admin/manage-posts', blogController.getAllPosts);  // Get all posts
router.get('/admin/create-post', (req, res) => res.render('pages/admin/createPost'));  // Render form for creating posts
router.post('/admin/create-post', upload.single('image'), blogController.createPost);  // Create post with image
router.get('/admin/edit-post/:id', blogController.editPostForm);  // Render form for editing post
router.post('/admin/edit-post/:id', upload.single('image'), blogController.updatePost);  // Update post with image
router.get('/admin/view-post/:id', blogController.viewPost);  // View post in admin panel
router.get('/admin/delete-post/:id', blogController.deletePost);  // Delete post

// Frontend routes
router.get('/blog/:id', blogController.viewPost);  // Display single post
router.get('/blog', blogController.blogList);  // List all blog posts

router.get('/events/blog', blogController.postsblog);  // Display events blog

module.exports = router;  // ✅ Fixed export typo here
