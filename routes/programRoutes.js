const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');


router.get('/ourPrograms', programController.renderOurProgramPage);


module.exports = router;
