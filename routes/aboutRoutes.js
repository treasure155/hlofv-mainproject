const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');



// Define the routes for the about pages
router.get('/team', aboutController.renderOurTeamPage);
router.get('/story', aboutController.renderOurStoryPage);  // Ensure '/story' is the correct route
router.get('/vision', aboutController.renderOurVisionPage);
router.get('/gallery', aboutController.renderGalleryPage);

module.exports = router;

