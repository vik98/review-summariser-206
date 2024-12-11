import IReviewController from "../interfaces/IReviewController";
import IReviewService from "../interfaces/IReviewService";
import Review, { ReviewWithId } from "../models/review";
import { NextFunction, Request, Response } from "express";
import { PostReview, PutReview, Reviews } from "../schemas/review";
import { ZodError } from "zod";
import { ParamsWithId, ParamsWithProductId, ParamsWithProductIdRevewId } from "../schemas/params-with-id";
import { SORT_BY, SORT_ORDER } from "../models/filter-by";
import logger from "../utils/logger";
import { NotFoundError } from "../exceptions/not-found-error";
import { DatabaseError } from "../exceptions/database-error";
import { BadRequestError } from "../exceptions/bad-request-error";
import { GoogleGenerativeAI } from "@google/generative-ai";

require('dotenv').config();

class ReviewController implements IReviewController {
    private readonly reviewService: IReviewService;

    constructor(reviewService: IReviewService) {
        this.reviewService = reviewService;
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.createOne = this.createOne.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.getSummary = this.getSummary.bind(this);
    }

    async findAll(req: Request, res: Response<ReviewWithId[]>, next: NextFunction) {
        try {
            if (!req.params.productId) {
                throw new BadRequestError("No Product ID Found")
            }
            const page = parseInt(req.query.page as string) || 1;
            const sortBy = req.query.sortBy as SORT_BY | undefined;
            const sortOrder = req.query.sortOrder as SORT_ORDER | undefined;

            const reviews = await this.reviewService.findAllReviews(req.params.productId, page, sortBy, sortOrder);
            console.log(reviews)
            res.json(reviews);

        } catch (error) {

            logger.error(`Error in findAll: ${error}`);

            if (error instanceof BadRequestError) res.status(400)

            if (error instanceof DatabaseError) res.status(404)

            next(error)
        }
    }

    async createOne(req: Request<ParamsWithProductId, ReviewWithId, PostReview>, res: Response<ReviewWithId>, next: NextFunction) {
        try {

            // console.log(JSON.stringify(req.params) + " req")
            // console.log(req.body.product_id + " body")

            if (req.body.product_id != req.params.productId) throw new BadRequestError("ProductID in Req and URL do not match")

            //req.body.product_id = req.productId

            const randomIP = () =>
                `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            const platforms = ["web", "mobile", "tablet", "API"];
            const devices = ["iPhone 13", "Galaxy S22", "Windows PC", "MacBook Pro"];
            const systems = ["CRM", "E-commerce", "Feedback Portal"];
            const referrers = [
                "https://google.com",
                "https://facebook.com",
                "https://twitter.com",
                "https://productsite.com",
            ];
            const classifications = ["positive", "negative", "neutral"];
            const locales = ["en-US", "fr-FR", "es-ES", "de-DE"];
            const permissions = [["read"], ["read", "write"], ["read", "write", "delete"]];

            const review: Review = {
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date(),
                helpful: 0,
                comment: [],
                meta_data: {
                    submission_platform:
                        platforms[Math.floor(Math.random() * platforms.length)],
                    submission_ip: randomIP(),
                    origin_system: systems[Math.floor(Math.random() * systems.length)],
                    device_type: devices[Math.floor(Math.random() * devices.length)],
                    referrer_url: referrers[Math.floor(Math.random() * referrers.length)],
                    is_archived: Math.random() < 0.5,
                    is_active: Math.random() < 0.8,
                    classification:
                        classifications[Math.floor(Math.random() * classifications.length)],
                    click_count: Math.floor(Math.random() * 1000),
                    locale: locales[Math.floor(Math.random() * locales.length)],
                    permissions: permissions[Math.floor(Math.random() * permissions.length)],
                }
            }

            console.log(review)

            const insertedReviewId = await this.reviewService.insertOneReview(req.params.productId, review)

            res.status(201)

            res.json({
                _id: insertedReviewId,
                ...review
            })

        } catch (error) {
            logger.error(`Error in createOne: ${error}`);

            res.status(400)

            if (error instanceof DatabaseError) res.status(404)


            next(error)
        }
    }

    async findOne(req: Request<ParamsWithProductIdRevewId, ReviewWithId, {}>, res: Response<ReviewWithId>, next: NextFunction) {
        try {
            const review = await this.reviewService.findOneReview(req.params.productId, req.params.reviewId);

            if (!review) {
                res.status(404);
                throw new NotFoundError("Review ID Not Found")
            }

            res.json(review);

        } catch (error) {
            logger.error(`Error in findOne: ${error}`);
            res.status(404)
            next(error)
        }
    }

    async updateOne(req: Request<ParamsWithProductIdRevewId, ReviewWithId, PutReview>, res: Response<ReviewWithId>, next: NextFunction) {
        try {
            //console.log(req.body)
            const insertedReview = await this.reviewService.updateOneReview(req.params.productId, req.params.reviewId, req.body)

            res.status(200)

            res.json(insertedReview)

        } catch (error) {
            logger.error(`Error in updateOne: ${error}`);
            res.status(404)
            next(error)
        }
    }

    async deleteOne(req: Request<ParamsWithProductIdRevewId>, res: Response, next: NextFunction) {
        try {
            await this.reviewService.deleteOneReview(req.params.productId, req.params.reviewId)

            res.status(204).end()

        } catch (error) {
            logger.error(`Error in deleteOne: ${error}`);
            res.status(404)
            next(error)
        }
    }

    async getSummary(req: Request<ParamsWithProductId>, res: Response, next: NextFunction) {
        try {
            if (!req.params.productId) {
                throw new BadRequestError("No Product ID Found")
            }
            const sortBy = req.query.sortBy as SORT_BY | undefined;
            const sortOrder = req.query.sortOrder as SORT_ORDER | undefined;
            console.log(process.env.API_KEY)
            const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const reviews = await this.reviewService.findAllReviewsWithoutPagination(req.params.productId, sortBy, sortOrder);

            if (!reviews || reviews.length === 0) throw new NotFoundError("No reviews found for the product");

            const reviewTextList = reviews.map((review) => review.description);
            const prompt = `Summarize the following reviews:\n${reviewTextList.join('\n')}. For the output i want you to generate a json with following fields - important_keywords, sentiment, summarised_description, no_of_reviews that were used to generate the summary`;

            const response = await model.generateContent(
                prompt
            );
            //const jsonResponse = JSON.parse(response?.response?.candidates?.[0]?.content.parts[0].text as string)

            //console.log(jsonResponse)
            const jsonRawResponse = response?.response?.candidates?.[0]?.content.parts[0].text;
            const cleanedResponse = jsonRawResponse?.replace(/```json\n|\n```/g, '');
            //console.log(JSON.parse(cleanedResponse as string))
            res.json(JSON.parse(cleanedResponse as string));

        } catch (error) {

            logger.error(`Error in findAll: ${error}`);

            if (error instanceof BadRequestError) res.status(400)

            if (error instanceof DatabaseError) res.status(404)

            if (error instanceof NotFoundError) res.status(404)

            next(error)
        }

    }

}

export default ReviewController;