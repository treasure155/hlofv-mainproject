const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Session Middleware
app.use(session({
  secret: 'ijhgdihwgdhglchvhcsbwy68t387yo2e8yfgcuysgvu',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const programRoutes = require('./routes/programRoutes');
const getInvolvedRoutes = require('./routes/getInvolvedRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Use Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use(blogRoutes);
app.use('/about', aboutRoutes);
app.use('/programs', programRoutes);
app.use('/get-involved', getInvolvedRoutes);
app.use('/events', eventRoutes);
app.use(contactRoutes);

// 404 Page
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
