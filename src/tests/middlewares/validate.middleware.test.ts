import { validate } from "../../../src/middleware/validate.middleware";
import { Request } from "express";
import { z } from "zod";

describe("Validate Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testSchema = z.object({
    body: z.object({
      name: z.string().min(3),
      age: z.number().min(18),
    }),
    params: z.object({}),
    query: z.object({}),
  });

  it("should pass validation with correct data", () => {
    mockRequest.body = {
      name: "John Doe",
      age: 25,
    };

    const middleware = validate(testSchema);
    middleware(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should return error 400 when validation fails", () => {
    mockRequest.body = {
      name: "Jo",
      age: 15,    
    };

    const middleware = validate(testSchema);
    middleware(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Validation error",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: expect.any(String),
          message: expect.any(String),
        }),
      ]),
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should pass non-Zod errors to the next middleware", () => {
    const errorSchema = z.object({
      body: z.object({
        someField: z.string(),
      }),
      params: z.object({}),
      query: z.object({}),
    });

    jest.spyOn(errorSchema, 'parse').mockImplementation(() => {
      throw new Error('Error not related to Zod');
    });

    const middleware = validate(errorSchema);
    middleware(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toBe('Error not related to Zod');
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should validate fields in params and query", () => {
    const schemaWithParamsAndQuery = z.object({
      body: z.object({}),
      params: z.object({
        id: z.string(),
      }),
      query: z.object({
        sort: z.string(),
      }),
    });

    mockRequest.params = { id: "123" };
    mockRequest.query = { sort: "asc" };

    const middleware = validate(schemaWithParamsAndQuery);
    middleware(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("should handle multiple validation errors", () => {
    mockRequest.body = {
      name: "J",     
      age: "25",     
    };

    const middleware = validate(testSchema);
    middleware(
      mockRequest as Request,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Validation error",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: expect.any(String),
          message: expect.any(String),
        }),
      ]),
    });
    
    const responseData = mockResponse.json.mock.calls[0][0];
    expect(responseData.errors.length).toBeGreaterThan(1);
  });
});