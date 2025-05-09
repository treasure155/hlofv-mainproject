const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mainController = require('../controllers/mainController');

// Home page route
router.get('/', mainController.index);


router.get('/contact', mainController.renderContact);

router.get('/donate', mainController.donateNow);

router.post('/donate', mainController.submitDonation);

router.get('/donate-success', (req, res) => {
    res.render('pages/donateSuccess', { title: 'Thank You' });
  });
// Route to handle form submission
router.post('/contact', mainController.handleContactForm);

router.post('/contact', mainController.handleContactForm);

router.post('/subscribe', mainController.subscribeUser);


module.exports = router;
