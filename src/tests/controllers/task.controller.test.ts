import { createTask } from "../../../src/controllers/task.controller";
import Task from "../../../src/models/task.model";
import mongoose from "mongoose";

jest.mock("../../../src/models/task.model");

const mockTask = {
 _id: new mongoose.Types.ObjectId().toString(),
 title: "Test Task", 
 description: "This is a test task",
 completed: false,
 user: "12345",
 createdAt: new Date(),
 updatedAt: new Date(),
 __v: 0
};

describe("Task Controller - createTask", () => {
 let req: any, res: any;

 beforeEach(() => {
   req = {
     body: {
       title: "Test Task",
       description: "This is a test task"
     },
     user: { id: "12345" }
   };

   res = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn()
   };

   (Task as unknown as jest.Mock).mockImplementation(() => ({
     ...mockTask,
     save: jest.fn().mockResolvedValue(mockTask)
   }));
 });

 it("should create a task correctly", async () => {
   await createTask(req, res);

   expect(res.status).toHaveBeenCalledWith(201);
   expect(res.json).toHaveBeenCalledWith({
     message: "Task created successfully",
     task: expect.objectContaining({
       title: "Test Task",
       description: "This is a test task", 
       completed: false,
       user: "12345",
       __v: 0,
       _id: expect.any(String),
       createdAt: expect.any(Date),
       updatedAt: expect.any(Date)
     })
   });
 });

 it("should handle errors correctly", async () => {
   (Task as unknown as jest.Mock).mockImplementation(() => ({
     save: jest.fn().mockRejectedValue(new Error("Server error"))
   }));

   await createTask(req, res);

   expect(res.status).toHaveBeenCalledWith(500);
   expect(res.json).toHaveBeenCalledWith({
     message: "Server error",
     error: expect.any(Error)
   });
 });
});