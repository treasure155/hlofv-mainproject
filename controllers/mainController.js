const Post = require('../models/Blog');
const Contact = require('../models/Contact');
const Donation = require('../models/Donation');
const Subscriber = require('../models/Subscriber');
const PDFDocument = require('pdfkit');


const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
    try {
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(3);
        res.render('pages/home', {
            title: 'Home | Honourable Ladies of Value Foundation',
            recentPosts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.render('pages/home', {
            title: 'Home | Honourable Ladies of Value Foundation',
            recentPosts: []
        });
    }
};

exports.renderContact = (req, res) => {
    res.render('pages/contact'); 
  };


  exports.donateNow = (req, res) => {
    res.render('pages/donate', { title: 'Donate' });
  };
  
  exports.submitDonation = async (req, res) => {
    try {
      const { name, email, occupation, type, amount } = req.body;
  
      if (!name || !email || !type || !amount) {
        return res.status(400).render('pages/donate', {
          title: 'Donate',
          error: 'All required fields must be filled.',
        });
      }
  
      const donation = new Donation({
        name,
        email,
        occupation,
        type,
        amount,
        date: new Date()
      });
  
      await donation.save();
  
      res.redirect('/donate-success');
    } catch (error) {
      console.error('Donation submission error:', error);
      res.status(500).render('pages/donate', {
        title: 'Donate',
        error: 'An unexpected error occurred. Please try again later.'
      });
    }
  };
  

  // POST route to handle the contact form submission
  exports.handleContactForm = async (req, res) => {
    const { fullName, email, phone, message } = req.body;
  
    try {
      // Save the contact message to the database
      const newContact = new Contact({
        fullName,
        email,
        phone,
        message,
      });
      await newContact.save();
  
      // After saving, redirect to the thank you page with the user's name
      res.render('pages/thankyou', {
        fullName: fullName,
      });
    } catch (err) {
      console.error('Error saving contact message:', err);
      res.render('pages/contact', {
        errorMessage: 'There was an error submitting your message. Please try again.',
      });
    }
  };



// Handle newsletter subscription
exports.subscribeUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.redirect('/?subscribed=exists');
    }
    await Subscriber.create({ email });
    res.redirect('/?subscribed=success');
  } catch (err) {
    console.error(err);
    res.redirect('/?subscribed=error');
  }
};

// Render subscriber list in admin dashboard
exports.viewSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.render('pages/admin/subscribers', { subscribers });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
};

// Generate and download PDF
exports.downloadSubscribersPDF = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('List of Subscribers', { align: 'center' });
    doc.moveDown();

    subscribers.forEach((subscriber, index) => {
      doc.fontSize(12).text(`${index + 1}. ${subscriber.email} - ${subscriber.subscribedAt.toLocaleDateString()}`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
};
