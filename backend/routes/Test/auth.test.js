const request = require('supertest');
const app = require('../../index');
const db = require('../../db');

// Keep the timeout so the real network requests don't fail
jest.setTimeout(20000); 

describe('Authentication API Integration', () => {
  afterAll((done) => {
    db.end(); 
    done();
  });

  const uniqueEmail = `test_${Math.floor(Math.random() * 999)}@sarakway.com`;
  
  const testUser = {
    email: uniqueEmail,
    password: 'RealPassword123!',
    user_name: 'Test Guide'
  };

  describe('POST /auth/register', () => {
    it('should successfully create a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Registration successful');
    });
  });

  describe('POST /auth/login', () => {
    it('should successfully log in', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('email', testUser.email);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });
      
      expect(response.statusCode).toBe(401);
    });
  });
});