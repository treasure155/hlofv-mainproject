const Volunteer = require('../models/Volunteer');
const Blog = require('../models/Blog');


// Controller for rendering the about pages
exports.renderbecomemember = (req, res) => {
    res.render('pages/get-involved/become-member');  
};

// Controller for rendering the about pages
exports.renderpartner = (req, res) => {
    res.render('pages/get-involved/partner');
};


const programsList = [
  "Women Empowerment",
  "Support for Orphans",
  "Skill Acquisition",
  "Business Support",
  "Housing for Widows",
  "Community Development",
  "Education for All",
  "Health and Wellness"
];

const religions = ["Christianity", "Islam", "Traditional", "Others"];

// Render Volunteer Page
exports.rendervolunteer = async (req, res) => {
  try {
    const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(3);

    res.render('pages/get-involved/volunteer', {
      title: 'Volunteer With Us',
      programs: programsList,
      religions,
      query: req.query,
      recentPosts
    });
  } catch (err) {
    console.error('Error fetching recent posts:', err);
    res.render('pages/get-involved/volunteer', {
      title: 'Volunteer With Us',
      programs: programsList,
      religions,
      query: req.query,
      recentPosts: [] // fallback
    });
  }
};

// Submit Volunteer Form
exports.submitVolunteer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      city,
      phone,
      email,
      programs,
      reason,
      occupation,
      religion,
      age,
      comment
    } = req.body;

    const newVolunteer = new Volunteer({
      firstName,
      lastName,
      city,
      phone,
      email,
      programs: Array.isArray(programs) ? programs : [programs],
      reason,
      occupation,
      religion,
      age,
      comment
    });

    await newVolunteer.save();
    res.redirect('/get-involved/volunteer?success=1');
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    res.redirect('/get-involved/volunteer?error=1');
  }
};