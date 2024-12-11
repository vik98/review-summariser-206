import { WithId } from 'mongodb';
import Comment from './comment';
import IReview from '../interfaces/IReview';

class Review implements IReview {
    description: string;
    image: string[];
    comment: Comment[];
    tags: string[];
    score: number;
    helpful: number;
    product_id: string;
    is_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    user_id: string;
    location: string;
    meta_data: Record<string, string | number | boolean | string[]>;

    constructor(
        description: string,
        image: string[],
        comment: Comment[],
        tags: string[],
        score: number,
        helpful: number,
        product_id: string,
        is_verified: boolean,
        createdAt: Date,
        updatedAt: Date,
        title: string,
        user_id: string,
        location: string,
        meta_data: Record<string, string | number | boolean | string[]>
    ) {
        this.description = description;
        this.image = image;
        this.comment = comment;
        this.tags = tags;
        this.score = score;
        this.helpful = helpful;
        this.product_id = product_id;
        this.is_verified = is_verified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.title = title;
        this.user_id = user_id;
        this.location = location;
        this.meta_data = meta_data
    }
}

export type ReviewWithId = WithId<Review>;
export default Review;
