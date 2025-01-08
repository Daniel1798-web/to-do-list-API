import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied, token not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
        req.user = decoded.id;  
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }

};

export const verifyToken = (req: Request, res: Response | any, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as jwt.JwtPayload;
      req.user = decoded; 
      next(); 
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };