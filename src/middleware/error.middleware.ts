import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);  
    res.status(500).json({ message: "Something went wrong" , error: err.message });
};