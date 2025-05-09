exports.showLoginForm = (req, res) => {
    res.render('pages/admin/adminLogin', {
      title: 'Admin Login',
      error: null,
    });
  };
  
  exports.login = (req, res) => {
    const { username, password } = req.body;
  
    // Check if fields are provided
    if (!username || !password) {
      return res.render('pages/admin/adminLogin', {
        title: 'Admin Login',
        error: 'Both username and password are required.'
      });
    }
  
    // Simple hardcoded admin credentials (replace with DB check in production)
    if (username === 'admin' && password === 'admin234') {
      req.session.isAdmin = true;
      return res.redirect('/admin/dashboard');
    }
  
    // If invalid credentials
    res.render('pages/admin/adminLogin', {
      title: 'Admin Login',
      error: 'Invalid credentials. Please try again.'
    });
  };
  
  exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.redirect('/admin/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/admin/login');
    });
  };
  