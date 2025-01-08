import { registerUser, loginUser } from "../../../src/controllers/user.controller";
import User from "../../../src/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
 let req: any, res: any;

 beforeEach(() => {
   req = {
     body: {
       name: "Test User",
       email: "test@test.com",
       password: "password123"
     }
   };

   res = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn()
   };
 });

 describe("registerUser", () => {
   beforeEach(() => {
     (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
     (User.findOne as jest.Mock).mockResolvedValue(null);
     (User as unknown as jest.Mock).mockImplementation(() => ({
       save: jest.fn().mockResolvedValue({})
     }));
   });

   it("should register a new user successfully", async () => {
     await registerUser(req, res);

     expect(res.status).toHaveBeenCalledWith(201);
     expect(res.json).toHaveBeenCalledWith({
       message: "User registered successfully"
     });
   });

   it("should reject a duplicate email", async () => {
     (User.findOne as jest.Mock).mockResolvedValue({ email: "test@test.com" });

     await registerUser(req, res);

     expect(res.status).toHaveBeenCalledWith(400);
     expect(res.json).toHaveBeenCalledWith({
       message: "User already exists"
     });
   });
 });

 describe("loginUser", () => {
   const mockUser = {
     _id: "123",
     email: "test@test.com",
     password: "hashedPassword"
   };

   beforeEach(() => {
     (User.findOne as jest.Mock).mockResolvedValue(mockUser);
     (bcrypt.compare as jest.Mock).mockResolvedValue(true);
     (jwt.sign as jest.Mock).mockReturnValue("mockToken");
   });

   it("should login successfully", async () => {
     await loginUser(req, res);

     expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
       token: "mockToken",
       message: "Login successful"
     });
   });

   it("should reject a non-existent user", async () => {
     (User.findOne as jest.Mock).mockResolvedValue(null);

     await loginUser(req, res);

     expect(res.status).toHaveBeenCalledWith(404);
     expect(res.json).toHaveBeenCalledWith({
       message: "User not found"
     });
   });

   it("should reject an invalid password", async () => {
     (bcrypt.compare as jest.Mock).mockResolvedValue(false);

     await loginUser(req, res);

     expect(res.status).toHaveBeenCalledWith(401);
     expect(res.json).toHaveBeenCalledWith({
       message: "Invalid credentials"
     });
   });
 });
});