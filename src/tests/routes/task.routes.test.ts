import request from 'supertest';
import express from 'express';
import taskRouter from '../../routes/task.routes';
import * as taskController from '../../controllers/task.controller';
import { verifyToken } from '../../middleware/auth.middleware';

jest.mock('../../middleware/auth.middleware', () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

jest.mock('../../controllers/task.controller');

describe('Task Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/tasks', taskRouter);
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should create a new task', async () => {
      const mockTask = { title: 'Test Task', description: 'Test Description' };
      (taskController.createTask as jest.Mock).mockImplementation(
        (req, res) => res.status(201).json(mockTask)
      );

      const response = await request(app)
        .post('/tasks')
        .send(mockTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTask);
      expect(verifyToken).toHaveBeenCalled();
    });
  });

  describe('GET /', () => {
    it('should get all tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }, { id: 2, title: 'Task 2' }];
      (taskController.getAllTasks as jest.Mock).mockImplementation(
        (req, res) => res.json(mockTasks)
      );

      const response = await request(app)
        .get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(verifyToken).toHaveBeenCalled();
    });
  });

  describe('GET /:id', () => {
    it('should get task by id', async () => {
      const mockTask = { id: 1, title: 'Task 1' };
      (taskController.getTaskById as jest.Mock).mockImplementation(
        (req, res) => res.json(mockTask)
      );

      const response = await request(app)
        .get('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(verifyToken).toHaveBeenCalled();
    });
  });
});