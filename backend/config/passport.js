// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // 1. Create temp password
          const tempPassword = crypto.randomBytes(8).toString('hex'); // 16 chars
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // 2. Create user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            gender: 'other',
            dob: new Date('1970-01-01'),
            password: hashedPassword,
            role: 'patient',
            isVerified: true, // since Google verified the email
          });
          await user.save();
          const welcomeEmailHtml = `<!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
                  <tr>
                      <td align="center" style="padding: 20px;">
                          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px;">
                              
                              <!-- Header -->
                              <tr>
                                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">MediLink</h1>
                                      <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Healthcare Connection Platform</p>
                                  </td>
                              </tr>
                              
                              <!-- Welcome Message -->
                              <tr>
                                  <td style="padding: 50px 40px 30px 40px; text-align: center;">
                                      <div style="background-color: #f0fdf4; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 30px auto; display: flex; align-items: center; justify-content: center;">
                                          <span style="font-size: 40px; color: #10b981;">🎉</span>
                                      </div>
                                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600;">Welcome to MediLink!</h2>
                                      <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 18px; line-height: 1.5;">Hi <strong style="color: #1f2937;">${user.name}</strong>,</p>
                                      <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">Your account has been successfully created! We're excited to have you join our healthcare platform.</p>
                                  </td>
                              </tr>
                              
                              <!-- Temporary Password Section -->
                              <tr>
                                  <td style="padding: 0 40px 40px 40px;">
                                      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                          <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600; text-align: center;">Your Temporary Password</h3>
                                          <div style="background-color: #ffffff; border: 2px dashed #f59e0b; border-radius: 6px; padding: 15px; text-align: center;">
                                              <code style="color: #92400e; font-size: 24px; font-weight: bold; letter-spacing: 2px; font-family: 'Courier New', monospace;">${tempPassword}</code>
                                          </div>
                                      </div>
                                      
                                      <!-- Instructions -->
                                      <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; text-align: left;">
                                          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Next Steps:</h3>
                                          <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                                              <li style="margin-bottom: 8px;">Log in to MediLink using your email and the temporary password above</li>
                                              <li style="margin-bottom: 8px;">Navigate to your profile settings</li>
                                              <li style="margin-bottom: 8px;">Set a new, secure password of your choice</li>
                                              <li>Start exploring your healthcare dashboard!</li>
                                          </ol>
                                      </div>
                                      
                                      <!-- CTA Button -->
                                      <div style="text-align: center; margin-top: 30px;">
                                          <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 15px 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">Login to MediLink</a>
                                      </div>
                                  </td>
                              </tr>
                              
                              <!-- Security Notice -->
                              <tr>
                                  <td style="padding: 0 40px 40px 40px;">
                                      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 4px;">
                                          <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;"><strong>Security Reminder:</strong> Please change your temporary password immediately after logging in. Never share your password with anyone.</p>
                                      </div>
                                  </td>
                              </tr>
                              
                              <!-- Footer -->
                              <tr>
                                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need help? Contact our support team anytime.</p>
                                      <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">© 2025 MediLink. All rights reserved.</p>
                                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
                                  </td>
                              </tr>
                              
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>`;
          
          await sendEmail(
              user.email,
              'Welcome to MediLink! Temporary Password',
              welcomeEmailHtml
          );
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id || user._id); // Ensure it's a valid value
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
