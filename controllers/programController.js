const Blog = require('../models/Blog');

exports.renderOurProgramPage = async (req, res) => {
  try {
    // Fetch latest 3 posts, adjust as needed
    const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(3);
    
    res.render('pages/programs/ourPrograms', {
      recentPosts
    });
  } catch (err) {
    console.error('Error fetching recent posts:', err);
    res.render('pages/programs/ourPrograms', {
      recentPosts: [] // Fail-safe empty array
    });
  }
};

// exports.renderOurProgramPage = (req, res) => {
//     res.render('pages/programs/ourPrograms');  
// };

