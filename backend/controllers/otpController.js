import nodemailer from 'nodemailer';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

// In-memory OTP store: { email: { otp, expiresAt } }
const otpStore = {};

// POST /api/users/forgot-password — send OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with that email.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // expires in 10 mins

    // Create transporter here so it reads env vars AFTER dotenv.config() has run
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Labhante Automotive Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px; background: #0a0a0a; color: #fff;">
          <h2 style="color: #d4af37; text-align: center;">Labhante Automotive Studio</h2>
          <p style="text-align: center; color: #aaa;">Password Reset Request</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 42px; font-weight: bold; letter-spacing: 10px; color: #4FA8D1;">${otp}</span>
          </div>
          <p style="color: #aaa; text-align: center;">This OTP is valid for <strong style="color: #fff;">10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border-color: #333;" />
          <p style="color: #555; font-size: 12px; text-align: center;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// POST /api/users/verify-otp — verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: 'OTP not found. Please request again.' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

  res.json({ message: 'OTP verified successfully.' });
};

// POST /api/users/reset-password — set new password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email]; // Clear OTP after use
    res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password.' });
  }
};
