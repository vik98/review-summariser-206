import * as z from 'zod';

export const ParamsWithIdSchema = z.object({
    id: z.string().min(1),
});

export const ParamsWithProductIdSchema = z.object({
    productId: z.string().min(5)
});

export const ParamsWithProductIdRevewIdSchema = z.object({
    productId: z.string().min(5),
    reviewId: z.string().min(5)
});

export type ParamsWithId = z.infer<typeof ParamsWithIdSchema>

export type ParamsWithProductId = z.infer<typeof ParamsWithProductIdSchema>

export type ParamsWithProductIdRevewId = z.infer<typeof ParamsWithProductIdRevewIdSchema>