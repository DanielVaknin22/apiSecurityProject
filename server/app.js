const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use('/', userRoutes);
app.use('/', apiRoutes);

module.exports = app;
