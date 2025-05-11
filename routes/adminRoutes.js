const express = require('express');
const router = express.Router();
const adminLoginController = require('../controllers/adminLoginController');
const Blog = require('../models/Blog');
const Volunteer = require('../models/Volunteer'); 
const PDFDocument = require('pdfkit'); 
const fs = require('fs');
const path = require('path');
const Contact = require('../models/Contact'); 
const mainController = require('../controllers/mainController');
const Subscriber = require('../models/Subscriber');
const Donation = require('../models/Donation');
const auth = require('../middlewares/auth');

// Admin Login Routes
router.get('/login', adminLoginController.showLoginForm);
router.post('/login', adminLoginController.login);
router.get('/logout', adminLoginController.logout);

// Admin Route to download a volunteer's details as PDF
router.get('/download-volunteer/:id', auth.isAdmin, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    // Create a PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=volunteer_${volunteer.firstName}_${volunteer.lastName}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Volunteer Details', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Name: ${volunteer.firstName} ${volunteer.lastName}`);
    doc.text(`City: ${volunteer.city}`);
    doc.text(`Phone: ${volunteer.phone}`);
    doc.text(`Email: ${volunteer.email ? volunteer.email : 'N/A'}`);
    doc.text(`Programs: ${volunteer.programs.join(', ')}`);
    doc.text(`Reason for Volunteering: ${volunteer.reason}`);
    doc.text(`Occupation: ${volunteer.occupation}`);
    doc.text(`Religion: ${volunteer.religion}`);
    doc.text(`Age: ${volunteer.age}`);
    doc.text(`Comment: ${volunteer.comment ? volunteer.comment : 'No comment'}`);
    doc.moveDown(2);
    doc.text(`Date Submitted: ${volunteer.createdAt.toLocaleDateString()}`, { align: 'left' });

    // End the document
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

// Admin Route for managing volunteers and displaying recent volunteers
router.get('/volunteers', auth.isAdmin, async (req, res) => {
  try {
    // Fetch recent volunteers from the database
    const recentVolunteers = await Volunteer.find().sort({ createdAt: -1 }).limit(10); // Adjust limit as needed

    // Render the volunteer management page
    res.render('pages/admin/manageVolunteers', { recentVolunteers });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching volunteers");
  }
});

// Admin Route to download all volunteers of a specific program as PDF
router.get('/download-volunteers-by-program/:program', auth.isAdmin, async (req, res) => {
  try {
    // Find volunteers by program
    const volunteers = await Volunteer.find({ programs: req.params.program });

    if (volunteers.length === 0) {
      return res.status(404).send("No volunteers found for this program");
    }

    // Create a PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers_by_program.pdf');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add title to the PDF
    doc.fontSize(20).text(`Volunteers for ${req.params.program}`, { align: 'center' });
    doc.moveDown(2);

    // Loop through the volunteers and add their details to the PDF
    volunteers.forEach(volunteer => {
      doc.fontSize(12).text(`Name: ${volunteer.firstName} ${volunteer.lastName}`);
      doc.text(`City: ${volunteer.city}`);
      doc.text(`Phone: ${volunteer.phone}`);
      doc.text(`Email: ${volunteer.email ? volunteer.email : 'N/A'}`);
      doc.text(`Reason for Volunteering: ${volunteer.reason}`);
      doc.text(`Age: ${volunteer.age}`);
      doc.text(`Comment: ${volunteer.comment || 'No comment'}`);
      doc.moveDown(1);
    });

    // End the document
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF for program");
  }
});

// Admin Route for contacts management with pagination and search
router.get('/contacts', auth.isAdmin, async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';

    const query = {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    };

    const contacts = await Contact.find(query)
      .sort({ submittedAt: -1 })
      .skip((perPage * page) - perPage)
      .limit(perPage);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / perPage);

    res.render('pages/admin/manageContacts', {
      contacts,
      currentPage: page,
      totalPages,
      search // ✅ Fixes the EJS error
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Admin Route for dashboard statistics
router.get('/dashboard', auth.isAdmin, async (req, res) => {
  try {
    // Blog stats
    const totalPosts = await Blog.countDocuments();
    const publishedPosts = await Blog.countDocuments({ published: true });
    const draftPosts = await Blog.countDocuments({ published: false });

    // Contact messages
    const contactCount = await Contact.countDocuments();

    // Volunteer stats
    const totalVolunteers = await Volunteer.countDocuments();
    const activeVolunteers = await Volunteer.countDocuments({ status: 'Active' });

    // Donation stats
    const totalDonations = await Donation.countDocuments();
    const totalAmount = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalAmountDonated = totalAmount[0]?.total || 0;
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(10);

    // Newsletter Subscribers
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });

    // Render dashboard with all stats and data
    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard',
      totalPosts,
      publishedPosts,
      draftPosts,
      totalVolunteers,
      activeVolunteers,
      contactCount,
      totalDonations,
      totalAmountDonated,
      donations,
      subscribers
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send("Server Error");
  }
});

// Admin Route to download a list of all subscribers as PDF
router.get('/subscribers/download', mainController.downloadSubscribersPDF);

module.exports = router;
