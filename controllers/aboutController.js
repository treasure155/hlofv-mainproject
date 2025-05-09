const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Controller for rendering the about pages
exports.renderOurStoryPage = (req, res) => {
    res.render('pages/about/story');  
};

// Controller for rendering the about pages
exports.renderOurTeamPage = (req, res) => {
    const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
    
    // Read files in the gallery directory
    fs.readdir(galleryDir, (err, files) => {
      if (err) {
        console.error('Error reading gallery folder:', err);
        return res.render('pages/about/team', { title: 'Our Team', galleryImages: [] });
      }
  
      // Filter only image files (optional)
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  
      // Render the page with the gallery images
      res.render('pages/about/team', { title: 'Our Team', galleryImages: imageFiles });
    });
  };

exports.renderOurVisionPage = (req, res) => {
    res.render('pages/about/vision');  
};


exports.renderGalleryPage = async (req, res) => {
  try {
    // Fetch latest 3 posts, adjust as needed
    const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(3);
    
    res.render('pages/about/gallery', {
      recentPosts
    });
  } catch (err) {
    console.error('Error fetching recent posts:', err);
    res.render('pages/about/gallery', {
      recentPosts: [] // Fail-safe empty array
    });
  }
};
