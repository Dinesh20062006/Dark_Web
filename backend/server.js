const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Set up MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Routes
const authRoutes = require('./routes/authRoutes');
const levelRoutes = require('./routes/levelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Project Dark API is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
