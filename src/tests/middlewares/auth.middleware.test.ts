import { protect, verifyToken } from "../../../src/middleware/auth.middleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
 let mockReq: any;
 let mockRes: any;
 let nextFunction: jest.Mock;

 beforeEach(() => {
   mockReq = {
     header: jest.fn()
   };
   mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn()
   };
   nextFunction = jest.fn();
 });

 describe("protect middleware", () => {
   it("should pass with valid token", () => {
     mockReq.header.mockReturnValue("Bearer validToken");
     (jwt.verify as jest.Mock).mockReturnValue({ id: "userId" });

     protect(mockReq, mockRes, nextFunction);

     expect(mockReq.user).toBe("userId");
     expect(nextFunction).toHaveBeenCalled();
   });

   it("should fail without token", () => {
     mockReq.header.mockReturnValue(undefined);

     protect(mockReq, mockRes, nextFunction);

     expect(mockRes.status).toHaveBeenCalledWith(401);
     expect(mockRes.json).toHaveBeenCalledWith({ 
       message: "Access denied, token not provided" 
     });
   });

   it("should fail with invalid token", () => {
     mockReq.header.mockReturnValue("Bearer invalidToken");
     (jwt.verify as jest.Mock).mockImplementation(() => {
       throw new Error();
     });

     protect(mockReq, mockRes, nextFunction);

     expect(mockRes.status).toHaveBeenCalledWith(401);
     expect(mockRes.json).toHaveBeenCalledWith({ 
       message: "Invalid Token" 
     });
   });
 });

 describe("verifyToken middleware", () => {
   it("should pass with valid token", () => {
     mockReq.header.mockReturnValue("Bearer validToken");
     const decodedToken = { id: "userId" };
     (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

     verifyToken(mockReq, mockRes, nextFunction);

     expect(mockReq.user).toEqual(decodedToken);
     expect(nextFunction).toHaveBeenCalled();
   });

   it("should fail without token", () => {
     mockReq.header.mockReturnValue(undefined);

     verifyToken(mockReq, mockRes, nextFunction);

     expect(mockRes.status).toHaveBeenCalledWith(401);
     expect(mockRes.json).toHaveBeenCalledWith({ 
       message: "Unauthorized access" 
     });
   });

   it("should fail with invalid token", () => {
     mockReq.header.mockReturnValue("Bearer invalidToken");
     (jwt.verify as jest.Mock).mockImplementation(() => {
       throw new Error();
     });

     verifyToken(mockReq, mockRes, nextFunction);

     expect(mockRes.status).toHaveBeenCalledWith(401);
     expect(mockRes.json).toHaveBeenCalledWith({ 
       message: "Invalid or expired token" 
     });
   });
 });
});