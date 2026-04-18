const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
      return next(); // Return here to avoid falling through to "if (!token)"
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};
module.exports = { protect };
