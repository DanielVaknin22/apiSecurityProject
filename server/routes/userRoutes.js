const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../controllers/apiController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/apikey', authenticateToken, (req, res) => {
  const newApiKey = userController.generateApiKey(req.user);
  res.json({ apiKey: newApiKey });
});

module.exports = router;
