
import * as z from 'zod';
import DbConnection from '../db';
import { ReviewSchema } from './review';
import ReviewSummary from '../models/review-summary';

export const ReviewSummarySchema = z.object({

    total_score: z.number().int(),
    number_of_reviews: z.number().int(),
    product_id: z.string().max(1000),
    ratings: z.object({
        one_star: z.number().int(),
        two_star: z.number().int(),
        three_star: z.number().int(),
        four_star: z.number().int(),
        five_star: z.number().int(),
    }),
    tags: z.array(z.string()),
    images: z.array(z.string()),
    most_recent_reviews: z.array(ReviewSchema).max(10),
    most_helpful_reviews: z.array(ReviewSchema).max(10),
    createdAt: z.string().transform((str) => new Date(str)),
    updatedAt: z.string().transform((str) => new Date(str))

});

export const PutReviewSummarySchema = z.object({
    total_score: z.number().int(),
    number_of_reviews: z.number().int(),
    product_id: z.string().max(1000),
    ratings: z.object({
        one_star: z.number().int(),
        two_star: z.number().int(),
        three_star: z.number().int(),
        four_star: z.number().int(),
        five_star: z.number().int(),
    }),
    tags: z.array(z.string()),
    images: z.array(z.string()),
    most_recent_reviews: z.array(ReviewSchema).max(10),
    most_helpful_reviews: z.array(ReviewSchema).max(10),
}).strict();

export type PutReviewSummary = z.infer<typeof PutReviewSummarySchema>

export const ReviewSummaries = new DbConnection().getDb().collection<ReviewSummary>('review-summaries');