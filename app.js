const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');


const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

dotenv.config();


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));
  

app.use(session({
      secret: 'ijhgdihwgdhglchvhcsbwy68t387yo2e8yfgcuysgvu', 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } 
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

app.get('/about/team', (req, res) => {
  const galleryDir = path.join(__dirname, 'public/images/gallery');
  
  // Read files in the gallery directory
  fs.readdir(galleryDir, (err, files) => {
    if (err) {
      console.error('Error reading gallery folder:', err);
      return res.render('pages/about/team', { title: 'Our Team', galleryImages: [] });
    }

    // Filter only image files (optional)
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.render('pages/about/team', { title: 'Our Team', galleryImages: imageFiles });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
