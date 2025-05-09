const express = require('express');
const router = express.Router();
const getInvolvedController = require('../controllers/getInvolvedController');

// Define the routes for the about pages
router.get('/become-member', getInvolvedController.renderbecomemember);
router.get('/partner', getInvolvedController.renderpartner);  

router.get('/volunteer', getInvolvedController.rendervolunteer);
router.post('/volunteer', getInvolvedController.submitVolunteer);


module.exports = router;

