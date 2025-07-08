require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Redis = require('ioredis');
const connectRedis = require('connect-redis');
const session = require('express-session');

// App & Middleware
const app = express();
app.use(express.json());

// Redis Setup
const RedisStore = connectRedis(session);
const redisClient = new Redis(process.env.REDIS_URL);

// Session Setup
app.use(session({
  name: 'navcart.sid',
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS in production
    sameSite: 'Lax',
  }
}));

// CORS Config
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: { username: newUser.username }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already taken." });
    }
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password." });

    req.session.user = { username: user.username };
    res.status(200).json({ message: "Login successful.", user: { username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed." });
    res.clearCookie('navcart.sid');
    res.status(200).json({ message: "Logged out" });
  });
});

// Check Session
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ loggedIn: true, user: { username: req.session.user.username } });
  } else {
    return res.status(401).json({ loggedIn: false });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
