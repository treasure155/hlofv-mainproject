const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Controller for rendering the about pages
exports.renderOurStoryPage = (req, res) => {
    res.render('pages/about/story');  
};

// Controller for rendering the about pages
exports.renderOurTeamPage = (req, res) => {
  res.render('pages/about/team', { title: 'Our Team' });
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
