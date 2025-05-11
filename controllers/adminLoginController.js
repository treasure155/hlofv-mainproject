// controllers/adminAuthController.js

// Show the admin login form
exports.showLoginForm = (req, res) => {
  res.render('pages/admin/adminLogin', {
    title: 'Admin Login',
    error: null,
  });
};

// Handle admin login logic
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Validate input fields
  if (!username || !password) {
    return res.render('pages/admin/adminLogin', {
      title: 'Admin Login',
      error: 'Both username and password are required.'
    });
  }

  // Hardcoded credentials (replace with DB lookup in future)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin234',
  };

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Store user info in session
    req.session.user = {
      username: ADMIN_CREDENTIALS.username,
      role: 'admin'
    };
    return res.redirect('/admin/dashboard');
  }

  // If login fails
  res.render('pages/admin/adminLogin', {
    title: 'Admin Login',
    error: 'Invalid credentials. Please try again.'
  });
};

// Handle admin logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.redirect('/admin/dashboard');
    }

    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/admin/login');
  });
};
