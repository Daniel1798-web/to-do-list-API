import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User, { IUser } from "../../models/user.model";

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockImplementation((plaintext, hash) => Promise.resolve(true)),
  hash: jest.fn().mockImplementation((password, salt) => Promise.resolve(`hashed_${password}`)),
  genSalt: jest.fn().mockImplementation(() => Promise.resolve(10))
}));

describe("User Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(await uri);
    await User.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create and save a user correctly", async () => {
    const validUser: Partial<IUser> = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword123",
    };

    const user = new User(validUser);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(`hashed_${validUser.password}`);
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  it("should throw an error if a required field is missing", async () => {
    const invalidUser: Partial<IUser> = {
      email: "missing.name@example.com",
      password: "password123",
    };

    const user = new User(invalidUser);
    await expect(user.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it("should throw an error if the email is not unique", async () => {
    const user1: Partial<IUser> = {
      name: "User One",
      email: "duplicate@example.com",
      password: "password123",
    };

    const user2: Partial<IUser> = {
      name: "User Two",
      email: "duplicate@example.com",
      password: "password456",
    };

    await new User(user1).save();
    const duplicateUser = new User(user2);
    await expect(duplicateUser.save()).rejects.toThrowError(/E11000 duplicate key error/);
  });

  it("should encrypt the password before saving", async () => {
    const userWithPlainPassword: Partial<IUser> = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "plaintextpassword",
    };
  
    const user = new User(userWithPlainPassword);
    const savedUser = await user.save();
  
    expect(savedUser.password).toBe(`hashed_${userWithPlainPassword.password}`);
    
    const bcrypt = require('bcrypt');
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });
});