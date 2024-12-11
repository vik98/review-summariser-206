import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

import * as middlewares from './middleware/error-handlers';
import reviewRouter from './routes/reviews';
import logger from './utils/logger';
import IMessageResponse from './interfaces/IMessageResponse';
import ReviewService from './service/ReviewService';
import ReviewRouter from './routes/reviews';

require('dotenv').config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());

    // Tracing middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`Request received - Method: ${req.method}, URL: ${req.originalUrl}`);
      next();
    });

    // Param middleware
    this.app.param('productId', (req: Request, res: Response, next: NextFunction, productId: string) => {
      req.params.productId = productId;
      next();
    });
  }

  private initializeRoutes() {
    this.app.get<{}, IMessageResponse>("/", (req, res) => {
      res.json({
        message: "Hello World!",
      });
    });

    const reviewService = new ReviewService(); // Create an instance of ReviewService
    const reviewRouter = new ReviewRouter(reviewService); // Create an instance of ReviewRouter

    this.app.use("/product/:productId/reviews", reviewRouter.getRouter()); // Use the router from ReviewRouter
  }

  private initializeErrorHandlers() {
    this.app.use(middlewares.notFound);
    this.app.use(middlewares.errorHandler);
  }

  public start(port: number) {
    this.app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  }
}

export default App;
