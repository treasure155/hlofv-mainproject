const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const helmet = require('helmet');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ───────────────────────────────────────
// MongoDB Connection (Production Ready)
// ───────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// ───────────────────────────────────────
// Middleware
// ───────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ───────────────────────────────────────
// Sessions using MongoDB Store (production-safe)
// ───────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",       // For AOS or other scripts
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",   // Google Fonts
        "https://cdn.jsdelivr.net",       // AOS or Bootstrap CSS
        "'unsafe-inline'"                // Allow inline styles (use with caution)
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://yourcdn.com"
      ],
    }
  }
}));


// ───────────────────────────────────────
// Routes
// ───────────────────────────────────────
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const programRoutes = require('./routes/programRoutes');
const getInvolvedRoutes = require('./routes/getInvolvedRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use(blogRoutes);
app.use('/about', aboutRoutes);
app.use('/programs', programRoutes);
app.use('/get-involved', getInvolvedRoutes);
app.use('/events', eventRoutes);
app.use(contactRoutes);

// ───────────────────────────────────────
// Special Route for /about/team (Image Support)
// ───────────────────────────────────────
app.get('/about/team', (req, res) => {
  const galleryDir = path.join(__dirname, 'public/images/gallery');

  fs.readdir(galleryDir, (err, files) => {
    if (err) {
      console.error('Error reading gallery folder:', err.message);
      return res.render('pages/about/team', { title: 'Our Team', galleryImages: [] });
    }

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    res.render('pages/about/team', { title: 'Our Team', galleryImages: imageFiles });
  });
});

// ───────────────────────────────────────
// 404 Fallback
// ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// ───────────────────────────────────────
// Start Server
// ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
