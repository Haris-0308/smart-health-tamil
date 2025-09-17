
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Doctor = require('./models/Doctor');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('Gemini API Key loaded:', !!process.env.GEMINI_API_KEY);
console.log('Google Client ID loaded:', !!process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret loaded:', !!process.env.GOOGLE_CLIENT_SECRET);

const app = express();
const port = 5000;
const jwtSecret = process.env.JWT_SECRET;
 // Replace with a strong secret in production

app.use(cors());
app.use(bodyParser.json());

// Add express-session middleware for passport session support
app.use(session({
  secret: jwtSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoUri)
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  // Drop the old username index if it exists
  try {
    await mongoose.connection.db.collection('doctors').dropIndex('username_1');
    console.log('✅ Dropped old username index');
  } catch (err) {
    console.log('⚠️  Username index drop failed (may not exist):', err.message);
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'haris03082005@gmail.com', // Replace with your email
    pass: 'Haris0308@'   // Replace with your email password or app password
  }
});

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create doctor based on Google profile id
    let doctor = await Doctor.findOne({ googleId: profile.id });
    if (!doctor) {
      doctor = new Doctor({
        username: profile.emails[0].value,
        phone: profile.emails[0].value, // Use email as phone for Google users
        googleId: profile.id,
        password: null // No password since OAuth
      });
      await doctor.save();
    }
    return done(null, doctor);
  } catch (err) {
    return done(err, null);
  }
}
));

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Doctor.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.post('/send-reminder', (req, res) => {
  const { medName, time } = req.body;

  const mailOptions = {
    from: 'haris03082005@gmail.com', // Replace with your email
    to: 'haris.22aid@kongu.edu', // Replace with recipient email
    subject: 'Medicine Reminder',
    text: `This is a reminder to take your medicine: ${medName} at ${time}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Reminder email sent');
    }
  });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    // Successful authentication, generate JWT token and redirect to frontend
    const token = jwt.sign({ phone: req.user.phone }, jwtSecret, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/doctor-login?token=${token}`);
  }
);

app.get('/login-failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

// Doctor signup
app.post('/api/doctors/signup', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }
  try {
    const existingDoctor = await Doctor.findOne({ phone });
    if (existingDoctor) {
      return res.status(409).json({ message: 'Phone number already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ phone, password: hashedPassword, username: null });
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor signin
app.post('/api/doctors/signin', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }
  try {
    const doctor = await Doctor.findOne({ phone });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ phone: doctor.phone }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  try {
    console.log('Gemini API request prompt:', message);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a medical assistant providing basic medicine advice for common diseases in Tamil language. Keep responses helpful and accurate. User message: ${message}`;
    const result = await model.generateContent(prompt);
    console.log('Gemini API raw result:', result);
    const response = result.response.text();
    console.log('Gemini API response text:', response);
    res.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ response: 'மன்னிக்கவும், பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
