const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const playlistRoutes = require('./routes/playlist.routes');

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://spotify-frontend-three-lime.vercel.app",
    "https://spotify-frontend-rohit-dev1.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SpotifyClauded backend is running',
    status: 'ok',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/playlists', playlistRoutes);

module.exports = app;