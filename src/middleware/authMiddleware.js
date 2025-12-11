import admin from '../config/firebase.js';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token with Firebase Admin
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Get user from our DB
      let user = await User.findOne({ email: decodedToken.email });
      
      // If user doesn't exist in DB yet, use Firebase data temporarily
      // This ensures protected routes work even before user sync
      if (!user) {
        console.warn(`User ${decodedToken.email} not found in DB, using Firebase token data`);
        req.user = {
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email,
          role: 'member', // Default role
          photoURL: decodedToken.picture || null,
          _isTemporary: true // Flag to indicate this is not from DB
        };
      } else {
        req.user = user;
      }
      
      // Attach firebase info for reference
      req.firebaseUser = decodedToken;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route`);
    }
    next();
  };
};
