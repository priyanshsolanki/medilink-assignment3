const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');

// For email verification
router.get('/verify-email', authController.verifyEmail);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google OAuth step 1
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    // For REST API: Send JWT in JSON
    // res.json({ token, user });

    // For SPA: redirect to frontend with token in URL (preferred for React apps)
    res.redirect(`${process.env.CLIENT_URL}/google-auth-success?token=${token}`);
  }
);

module.exports = router;