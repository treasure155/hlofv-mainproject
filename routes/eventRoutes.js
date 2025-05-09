const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Route for upcoming events
router.get('/upcoming', eventController.renderUpcomingEvents);

module.exports = router;
