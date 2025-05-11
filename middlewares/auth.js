// middlewares/auth.js

module.exports.isAdmin = (req, res, next) => {
  const user = req.session.user;
  if (user && user.role === 'admin') {
    return next();
  }
  return res.status(403).render('pages/403', { title: 'Forbidden' });
};
