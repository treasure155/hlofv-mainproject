const Blog = require('../models/Blog');

// Create new blog post
exports.createPost = async (req, res) => {
  const { title, excerpt, body, tags } = req.body;
  const image = req.file ? req.file.filename : 'default.jpg';

  try {
    await Blog.create({ title, excerpt, body, image, tags });
    res.redirect('/admin/manage-posts');
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).send('Error creating blog post');
  }
};

// Get all blog posts (for admin management)
exports.getAllPosts = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('pages/admin/managePost', { blogs });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error fetching blog posts');
  }
};

// Render form to edit a blog post
exports.editPostForm = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Post not found');
    res.render('pages/admin/editPost', { blog });
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    res.status(500).send('Error loading edit form');
  }
};

// Update an existing blog post
exports.updatePost = async (req, res) => {
  const { title, excerpt, body, tags } = req.body;
  const image = req.file ? req.file.filename : undefined;

  const updateData = { title, excerpt, body, tags };
  if (image) updateData.image = image;

  try {
    await Blog.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/manage-posts');
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).send('Error updating blog post');
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manage-posts');
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).send('Error deleting blog post');
  }
};

// View a single blog post (admin view)
exports.viewPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.render('pages/admin/viewPost', { post });
  } catch (error) {
    console.error('Error loading blog post:', error);
    res.status(500).send('Error loading blog post');
  }
};

// Public blog list page (frontend)
exports.blogList = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('pages/events/blog', { blogs });
  } catch (error) {
    console.error('Error loading blog list:', error);
    res.status(500).send('Error loading blog list');
  }
};

// Recent 3 posts for homepage
exports.recentPosts = async () => {
  try {
    return await Blog.find().sort({ createdAt: -1 }).limit(3);
  } catch (error) {
    console.error('Error loading recent posts:', error);
    return [];
  }
};

// Controller to fetch and render blog posts with tags (filtering by tags functionality added)
exports.postsblog = async (req, res) => {
  try {
    const { tag } = req.query; // Get the tag from the query parameter

    let filter = {};  // Default filter (empty)
    if (tag) {
      filter = { tags: tag };  // Filter posts by tag if provided
    }

    const allPosts = await Blog.find(filter).sort({ createdAt: -1 }); // Fetch filtered posts
    const allTags = await Blog.distinct('tags');  // Fetch distinct tags

    res.render('pages/events/blog', {
      title: 'Blog | Honourable Ladies of Value Foundation',
      allPosts,  // Pass the filtered posts to the view
      allTags    // Pass the tags to the view
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.render('pages/events/blog', {
      title: 'Blog | Honourable Ladies of Value Foundation',
      allPosts: [],  // If there's an error, return an empty array for allPosts
      allTags: []    // Return empty tags as well
    });
  }
};
