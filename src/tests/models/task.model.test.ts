// src/tests/models/task.model.test.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Task, { ITask } from "../../models/task.model";

describe("Task Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(await uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should create and save a task correctly", async () => {
    const validTask: Partial<ITask> = {
      title: "New task",
      description: "Test Description",
      completed: false,
      user: new mongoose.Types.ObjectId(),
    };

    const task = new Task(validTask);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(validTask.title);
    expect(savedTask.description).toBe(validTask.description);
    expect(savedTask.completed).toBe(validTask.completed);
    expect(savedTask.user).toStrictEqual(validTask.user);
    expect(savedTask.createdAt).toBeDefined();
    expect(savedTask.updatedAt).toBeDefined();
  });

  it("should throw an error if a required field is missing", async () => {
    const invalidTask: Partial<ITask> = {
      description: "Untitled Assignment",
    };

    const task = new Task(invalidTask);

    await expect(task.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it("should set the default value 'completed' to false", async () => {
    const taskWithoutCompleted: Partial<ITask> = {
      title: "Task without completed status",
      user: new mongoose.Types.ObjectId(),
    };

    const task = new Task(taskWithoutCompleted);
    const savedTask = await task.save();

    expect(savedTask.completed).toBe(false);
  });
});
