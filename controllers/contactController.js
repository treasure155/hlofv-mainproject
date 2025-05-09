// controllers/contactController.js
const PDFDocument = require("pdfkit");
const moment = require("moment");
const Contact = require("../models/Contact");

exports.downloadContactsPDF = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    const contacts = await Contact.find({
      submittedAt: { $gte: start, $lte: end },
    }).sort({ submittedAt: -1 });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="contacts-${startDate}_to_${endDate}.pdf"`);

    doc.pipe(res);
    doc.fontSize(16).text(`Contact Submissions`, { align: "center" });
    doc.moveDown();

    contacts.forEach((contact, index) => {
      doc.fontSize(12).text(`No: ${index + 1}`);
      doc.text(`Name: ${contact.fullName}`);
      doc.text(`Email: ${contact.email}`);
      doc.text(`Phone: ${contact.phone}`);
      doc.text(`Message: ${contact.message}`);
      doc.text(`Date: ${moment(contact.submittedAt).format("YYYY-MM-DD HH:mm")}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to generate PDF");
  }
};



exports.getContacts = async (req, res) => {
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

  try {
    const contacts = await Contact.find(query)
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({ submittedAt: -1 });

    const count = await Contact.countDocuments(query);

    res.render('pages/admin/manageContacts', {
      contacts,
      current: page,
      pages: Math.ceil(count / perPage),
      search // ✅ This is the key part you missed
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

