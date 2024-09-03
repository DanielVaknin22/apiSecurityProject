const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/secure-data', apiController.authenticateApiKey, apiController.getSecureData);
router.get('/profile', apiController.authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}` });
});

module.exports = router;
