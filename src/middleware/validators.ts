import { NextFunction, Request, Response } from "express";
import IRequestValidator from "../interfaces/IRequestValidator";
import { ZodError } from "zod";


export const validateRequest = (requestValidator: IRequestValidator) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (requestValidator.params) req.params = await requestValidator.params.parseAsync(req.params);

        if (requestValidator.query) req.query = await requestValidator.query.parseAsync(req.query);

        if (requestValidator.body) req.body = await requestValidator.body.parseAsync(req.body);

        next()
    } catch (error) {

        if (error instanceof ZodError) res.status(422)

        next(error)
    }
}