const jwt = require('jsonwebtoken');
const { secretKey } = require('../models/userModel');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.sendStatus(401);

  jwt.verify(apiKey, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.getSecureData = (req, res) => {
  const secureData = {
    data: 'This is some secure data',
  };
  res.json(secureData);
};
