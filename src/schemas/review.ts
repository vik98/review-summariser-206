
import * as z from 'zod';
import DbConnection from '../db';
import { CommentSchema } from './comment';
import Review from '../models/review'

export const ReviewSchema = z.object({
    description: z.string().max(10000),
    image: z.array(z.string()).max(3),
    comment: z.array(CommentSchema).max(1),
    tags: z.array(z.string()),
    score: z.number().int().min(0).max(5),
    helpful: z.number().int(),
    product_id: z.string().uuid(),
    is_verified: z.boolean().default(false),
    createdAt: z.string().transform((str) => new Date(str)),
    updatedAt: z.string().transform((str) => new Date(str)),
    title: z.string().max(1000),
    user_id: z.string().uuid(),
    location: z.string(),
});

export const PutReviewSchema = z.object({
    description: z.string().max(10000),
    tags: z.array(z.string()),
    score: z.number().int().min(0).max(5),
    helpful: z.number().int(),
    is_verified: z.boolean().default(false),
    title: z.string().max(1000),
    location: z.string(),
    comment: z.array(CommentSchema).max(1),
}).strict();

export const PostReviewSchema = z.object({
    description: z.string().max(10000),
    image: z.array(z.string()).max(3),
    tags: z.array(z.string()),
    score: z.number().int().min(0).max(5),
    product_id: z.string().uuid(),
    is_verified: z.boolean().default(false),
    title: z.string().max(1000),
    user_id: z.string().uuid(),
    location: z.string(),
}).strict();

export type PutReview = z.infer<typeof PutReviewSchema>

export type PostReview = z.infer<typeof PostReviewSchema>

export const Reviews = new DbConnection().getDb().collection<Review>('reviews');