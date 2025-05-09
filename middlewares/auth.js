// middlewares/auth.js
module.exports.isAdmin = (req, res, next) => {
    // Assuming you have a user session or JWT for authentication
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).send('Forbidden');
  };
  
  exports.ensureAuthenticated = (req, res, next) => {
    // Placeholder — you can modify this to check sessions or JWT
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Or for a stateless API:
    // if (req.user) return next();
    
    return res.status(401).json({ message: 'You must be logged in to comment.' });
};
