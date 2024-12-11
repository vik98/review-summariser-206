import * as z from 'zod';
import Comment from '../models/comment';
import DbConnection from '../db';


export const CommentSchema = z.object({
    description: z.string().max(500),
    createdAt: z.string().transform((str) => new Date(str)),
    updatedAt: z.string().transform((str) => new Date(str)),
    title: z.string().max(100),
    user_id: z.string().uuid(),
});

//export type Comment = z.infer<typeof CommentSchema>;
export const Comments = new DbConnection().getDb().collection<Comment>('comments');