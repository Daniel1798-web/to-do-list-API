import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/user.routes';
import * as userController from '../../controllers/user.controller';

jest.mock('../../controllers/user.controller');

describe('Auth Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      };
      
      (userController.registerUser as jest.Mock).mockImplementation(
        (req, res) => res.status(201).json({ user: mockUser })
      );

      const response = await request(app)
        .post('/auth/register')
        .send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(userController.registerUser).toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      const mockError = { message: 'Email already exists' };
      (userController.registerUser as jest.Mock).mockImplementation(
        (req, res) => res.status(400).json(mockError)
      );

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'existing@test.com', password: 'test123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockError);
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const mockResponse = { token: 'jwt-token' };
      (userController.loginUser as jest.Mock).mockImplementation(
        (req, res) => res.json(mockResponse)
      );

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(userController.loginUser).toHaveBeenCalled();
    });

    it('should handle invalid credentials', async () => {
      const mockError = { message: 'Invalid credentials' };
      (userController.loginUser as jest.Mock).mockImplementation(
        (req, res) => res.status(401).json(mockError)
      );

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockError);
    });
  });
});