const jwt = require('jsonwebtoken');
const config = require('./config'); // Assuming JWT secret is in config

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied, token missing' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }

    req.user = user; // Attach the decoded user to the request object
    next(); // Proceed to the next middleware/handler
  });
};

module.exports = authenticateToken;
