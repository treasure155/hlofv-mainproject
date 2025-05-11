const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Trust proxy for secure cookies in production (e.g., if behind a proxy like Nginx)
app.set('trust proxy', 1);

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only true over HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Body parsing and static file middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

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
app.use(blogRoutes); // Blog routes like /blog/post/:id
app.use('/about', aboutRoutes);
app.use('/programs', programRoutes);
app.use('/get-involved', getInvolvedRoutes);
app.use('/events', eventRoutes);
app.use(contactRoutes); // e.g. /contact

// 404 Page
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

app.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard', {
        pageStylesheet: '/css/maindashboard.css'
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
