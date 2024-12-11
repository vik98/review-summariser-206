
import * as z from 'zod';
import DbConnection from '../db';
import ReviewAISummary from '../models/review-ai-summary';

export const ReviewAISummarySchema = z.object({
    no_of_reviews: z.number().int(),
    sentiment: z.string().max(1000),
    important_keywords: z.array(z.string()).max(10),
    number_of_reviews: z.number().int(),
    summarised_description: z.string().max(5000),

});

export const PutReviewAISummarySchema = z.object({
    no_of_reviews: z.number().int(),
    sentiment: z.string().max(1000),
    important_keywords: z.array(z.string()).max(10),
    number_of_reviews: z.number().int(),
    summarised_description: z.string().max(5000),
}).strict();

export type PutReviewAISummary = z.infer<typeof PutReviewAISummarySchema>

export const ReviewAISummaries = new DbConnection().getDb().collection<ReviewAISummary>('review-ai-summaries');