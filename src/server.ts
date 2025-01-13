import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";

import { errorHandler } from "./middleware/error.middleware";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

connectDB();



// Middleware

// Cors configuration

app.use(cors());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

  

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API working correctly with MongoDB");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes); 

app.use(errorHandler);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});