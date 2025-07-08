const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Redis = require('ioredis');
const connect_redis = require('connect-redis');
const session = require('express-session');

// App & Middleware
const app = express();
app.use(express.json());

const saltrounds = 10;

// Redis Setup
const RedisStore = connect_redis(session);
const redisClient = new Redis('redis://localhost:6379');

app.use(session({
  name: 'navcart.sid',
  store: new RedisStore({ client: redisClient }),
  secret: 'supersecretkey', // ✔️ Hardcoded for now
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // ❗ Since you're not using NODE_ENV='production'
    sameSite: 'Lax', // ❗ Match the `secure` value
  }
}));

// CORS Config
const corsOptions = {
  origin: 'https://navcart.vercel.app', // ✔️ Update if needed for localhost testing
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Port & Mongo
const port = 3000;
const mongoURL = 'mongodb://localhost:27017/navcartdb'; // ✔️ Hardcoded for now

mongoose.connect(mongoURL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, saltrounds);
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

// Session Check
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ loggedIn: true, user: { username: req.session.user.username } });
  } else {
    return res.status(401).json({ loggedIn: false });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
