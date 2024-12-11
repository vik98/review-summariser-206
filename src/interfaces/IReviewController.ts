import { ReviewWithId } from "../models/review"
import { NextFunction, Request, Response } from 'express';
import { ParamsWithId } from "../schemas/params-with-id";

interface IReviewController {
    findAll: (req: Request<ParamsWithId>, res: Response<ReviewWithId[]>, next: NextFunction) => Promise<void>;
}

export default IReviewController