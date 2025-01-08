import { asyncHandler, errorHandler } from "../../../src/middleware/error.middleware";
import { Request, Response, NextFunction } from "express";

describe("Error Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe("asyncHandler", () => {
    it("should handle a successful async function", async () => {
      const successfulAsync = async (req: Request, res: Response) => {
        return res.status(200).json({ success: true });
      };

      const wrappedHandler = asyncHandler(successfulAsync);
      await wrappedHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should catch and pass errors to the next middleware", async () => {
      const errorMessage = "Test error";
      const failingAsync = async () => {
        throw new Error(errorMessage);
      };

      const wrappedHandler = asyncHandler(failingAsync);
      await wrappedHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("errorHandler", () => {
    it("should return an error message and status code 500", () => {
      const mockError = new Error("Simulated Error");

      errorHandler(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Something went wrong",
        error: mockError.message,
      });
    });

    it("should print the error to the console", () => {
      const mockError = new Error("Test error");
      if (!mockError.stack) {
        mockError.stack = "Stack trace simulado";
      }

      errorHandler(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(consoleSpy).toHaveBeenCalledWith(mockError.stack);
    });
  });
});