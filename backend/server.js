require('dotenv').config(); // loads the variables from .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

app.use(cors()); // lets the React front end call this API
app.use(express.json()); // reads JSON request bodies

// Health check, required by Milestone 1
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
