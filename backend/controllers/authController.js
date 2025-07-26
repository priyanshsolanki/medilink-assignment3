// controllers/authController.js
const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");

exports.register = async (req, res) => {
  const { name, gender, dob, email, password, role, ...optionalFields } =
    req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User already exists" });
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;

  const emailVerificationHtml = `<!DOCTYPE html>
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
                          <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">MediLink</h1>
                              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Healthcare Connection Platform</p>
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td style="padding: 50px 40px 30px 40px; text-align: center;">
                              <div style="background-color: #dbeafe; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 30px auto; display: flex; align-items: center; justify-content: center;">
                                  <span style="font-size: 40px; color: #3b82f6;">✉️</span>
                              </div>
                              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600;">Verify Your Email Address</h2>
                              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 18px; line-height: 1.5;">Hi <strong style="color: #1f2937;">${name}</strong>,</p>
                              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">Welcome to MediLink! To complete your account setup and ensure the security of your healthcare data, please verify your email address.</p>
                          </td>
                      </tr>
                      
                      <!-- Verification Button -->
                      <tr>
                          <td style="padding: 0 40px 40px 40px; text-align: center;">
                              <div style="background-color: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                                  <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 16px;">Click the button below to verify your email address:</p>
                                  <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.2s;">Verify Email Address</a>
                              </div>
                              
                              <!-- Alternative Link -->
                              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: left;">
                                  <p style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600;">Can't click the button? Copy and paste this link:</p>
                                  <p style="margin: 0; word-break: break-all; color: #6b7280; font-size: 13px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">${verificationUrl}</p>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Important Info -->
                      <tr>
                          <td style="padding: 0 40px 40px 40px;">
                              <div style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px;">
                                  <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">Important Information:</h3>
                                  <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                                      <li style="margin-bottom: 5px;">This verification link will expire in 24 hours</li>
                                      <li style="margin-bottom: 5px;">You must verify your email to access all MediLink features</li>
                                      <li>If you didn't create this account, please ignore this email</li>
                                  </ul>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Security Notice -->
                      <tr>
                          <td style="padding: 0 40px 40px 40px;">
                              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 4px;">
                                  <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;"><strong>Security Tip:</strong> MediLink will never ask for your password via email. If you receive suspicious emails, please report them to our security team.</p>
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
      email,
      "Verify Your Email",
      emailVerificationHtml
  );

  user = new User({
    name,
    gender,
    dob,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    verificationToken,
    ...optionalFields,
  });
  await user.save();

  res.json({
    user: {
      id: user._id,
      name,
      gender,
      dob,
      email,
      role,
      ...optionalFields,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (user.verificationToken !== token) {
    return res.status(400).json({ msg: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined; // remove the token
  await user.save();

  res.json({ msg: "Email verified successfully" });
};

// -------- Login: Sends OTP, no login yet --------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Check if the email is verified
  if (!user.isVerified) {
    return res
      .status(403)
      .json({
        msg: "Email not verified. Please check your inbox to verify your account.",
      });
  }

  // Generate OTP and stateless JWT for verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpToken = jwt.sign(
    { userId: user._id, otp, purpose: "login" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const otpEmailHtml = `
  <!DOCTYPE html>
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
                          <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">Medilink</h1>
                              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Secure Healthcare Connection</p>
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td style="padding: 50px 40px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600;">Login Verification</h2>
                              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.5;">Please use the following One-Time Password to complete your login:</p>
                              
                              <!-- OTP Box -->
                              <div style="background-color: #f8fafc; border: 2px dashed #4f46e5; border-radius: 8px; padding: 20px; margin: 30px 0; display: inline-block;">
                                  <div style="color: #4f46e5; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                              </div>
                              
                              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">This OTP will expire in 10 minutes for your security.<br>If you didn't request this login, please ignore this email.</p>
                          </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                          <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 Medilink. All rights reserved.</p>
                              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">This is an automated message, please do not reply.</p>
                          </td>
                      </tr>
                      
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;

  await sendEmail(user.email, "Your Login OTP", otpEmailHtml);
  res.json({ otpSent: true, otpToken });
};

// -------- Verify Login OTP --------
exports.verifyLoginOtp = async (req, res) => {
  const { otpToken, otp } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.purpose !== "login")
      return res.status(400).json({ msg: "Invalid token purpose" });

    if (decoded.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(400).json({ msg: "Invalid or expired OTP token" });
  }
};

// -------- Forgot Password: Sends OTP, stateless --------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "No user with that email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpToken = jwt.sign(
    { userId: user._id, otp, purpose: "reset" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const passwordResetOtpHtml = `<!DOCTYPE html>
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
                          <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">MediLink</h1>
                              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Healthcare Connection Platform</p>
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td style="padding: 50px 40px 30px 40px; text-align: center;">
                              <div style="background-color: #fef2f2; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 30px auto; display: flex; align-items: center; justify-content: center;">
                                  <span style="font-size: 40px; color: #dc2626;">🔒</span>
                              </div>
                              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600;">Password Reset Request</h2>
                              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Use the One-Time Password below to proceed with resetting your password.</p>
                          </td>
                      </tr>
                      
                      <!-- OTP Section -->
                      <tr>
                          <td style="padding: 0 40px 40px 40px;">
                              <div style="background-color: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 30px; margin-bottom: 30px; text-align: center;">
                                  <h3 style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 18px; font-weight: 600;">Your Password Reset OTP</h3>
                                  <div style="background-color: #ffffff; border: 2px dashed #dc2626; border-radius: 6px; padding: 20px;">
                                      <code style="color: #dc2626; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</code>
                                  </div>
                              </div>
                              
                              <!-- Instructions -->
                              <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; text-align: left; margin-bottom: 25px;">
                                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">How to use this OTP:</h3>
                                  <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                                      <li style="margin-bottom: 8px;">Return to the password reset page</li>
                                      <li style="margin-bottom: 8px;">Enter the OTP code shown above</li>
                                      <li style="margin-bottom: 8px;">Create your new secure password</li>
                                      <li>Log in with your new password</li>
                                  </ol>
                              </div>
                              
                              <!-- Security Warning -->
                              <div style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px;">
                                  <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">⚠️ Security Notice:</h3>
                                  <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                                      <li style="margin-bottom: 5px;">This OTP will expire in <strong>10 minutes</strong></li>
                                      <li style="margin-bottom: 5px;">Never share this OTP with anyone</li>
                                      <li style="margin-bottom: 5px;">If you didn't request this reset, please ignore this email</li>
                                      <li>Contact support immediately if you suspect unauthorized access</li>
                                  </ul>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Didn't Request Section -->
                      <tr>
                          <td style="padding: 0 40px 40px 40px;">
                              <div style="background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 20px; border-radius: 4px;">
                                  <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;"><strong>Didn't request a password reset?</strong><br>Your account is still secure. You can safely ignore this email, and your password will remain unchanged.</p>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                          <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need help? Contact our support team anytime.</p>
                              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">© 2025 MediLink. All rights reserved.</p>
                              <p style="margin: 0; color: #9ca3af; font-size: 12px;">This is an automated security message, please do not reply to this email.</p>
                          </td>
                      </tr>
                      
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;
  
  await sendEmail(user.email, "Your Password Reset OTP", passwordResetOtpHtml);  res.json({ msg: "OTP sent to your email", otpToken });
};

// -------- Reset Password: Verify OTP & Update --------
exports.resetPassword = async (req, res) => {
  const { otpToken, otp, newPassword } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.purpose !== "reset")
      return res.status(400).json({ msg: "Invalid token purpose" });

    if (decoded.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password has been reset successfully" });
  } catch (err) {
    return res.status(400).json({ msg: "Invalid or expired OTP token" });
  }
};
