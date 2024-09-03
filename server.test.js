const request = require('supertest');
const app = require('./app');

describe('Authentication API', () => {
  test('It should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password' });

    expect(response.statusCode).toBe(201);
  });

  test('It should log in an existing user', async () => {
    await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password' });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
