import { NextFunction, Request, Response } from 'express';

import IErrorResponse from '../interfaces/IErrorResponse';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export const errorHandler = (err: Error, req: Request, res: Response<IErrorResponse>, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}
