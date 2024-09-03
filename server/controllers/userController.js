const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, secretKey } = require('../../models/userModel');

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ id: users.length + 1, username, password: hashedPassword });
  res.status(201).send('User registered successfully');
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing username or password');
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).send('User not found');
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send('Invalid Password');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
};

exports.generateApiKey = (user) => {
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1y' });
};
