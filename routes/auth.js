const router = require("express").Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password, role: "admin" });

  if (!user) return res.status(400).json("Invalid credentials");

  res.json(user);
});

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`
  });

  res.json("OTP Sent");
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    return res.json("Verified");
  }

  res.status(400).json("Invalid OTP");
});

module.exports = router;