// auth.js

const jwt = require('jsonwebtoken');
//Set a key that will be used to sign and validate the JWT
const SECRET_KEY = process.env.SECRET_KEY || 'yugiegie';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

module.exports = {
  verifyToken
};
