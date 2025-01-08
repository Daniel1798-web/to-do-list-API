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

const allowedOrigins = ['http://localhost:4200',];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(new Error('restricted access'), false);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('restricted access'));
    }
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