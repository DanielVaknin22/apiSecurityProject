const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

const users = [];
const secretKey = 'your_jwt_secret_key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // אם אין טוקן, מחזיר 401

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err); // הוסף לוג זה למעקב
            return res.sendStatus(403); // אם האימות נכשל, מחזיר 403
        }
        req.user = user;
        next();
    });
}


app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ id: users.length + 1, username, password: hashedPassword });
  res.status(201).send('User registered successfully');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received:', req.body);

    if (!username || !password) {
        console.error('Error: Missing username or password');
        return res.status(400).send('Missing username or password');
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        console.error('Error: User not found');
        return res.status(400).send('User not found');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        console.error('Error: Invalid Password');
        return res.status(401).send('Invalid Password');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.sendStatus(401);
  
    jwt.verify(apiKey, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  app.get('/secure-data', authenticateApiKey, (req, res) => {
    console.log('Received request for secure data');
    console.log('User:', req.user);
    const secureData = {
      data: 'This is some secure data'
    };
    res.json(secureData);
  });

app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}` });
});

function generateApiKey(user) {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1y' });
}

app.post('/apikey', authenticateToken, (req, res) => {
    console.log('API Key request received from:', req.user);
    const newApiKey = generateApiKey(req.user);
    res.json({ apiKey: newApiKey });
});


module.exports = app;
