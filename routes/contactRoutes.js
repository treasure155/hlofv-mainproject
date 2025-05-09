const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");


router.get("/admin/contacts/download-pdf", contactController.downloadContactsPDF);
router.get('/admin/contacts', contactController.getContacts);


module.exports = router;
