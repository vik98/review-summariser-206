import IReviewSummary from '../interfaces/IReviewSummary';
import IReview from '../interfaces/IReview';
import { WithId } from 'mongodb';
import IRatingScore from '../interfaces/IRatingScore';

class ReviewSummary implements IReviewSummary {
    total_score: number;
    number_of_reviews: number;
    product_id: string;
    ratings: IRatingScore;
    tags: string[];
    images: string[];
    most_recent_reviews: IReview[];
    most_helpful_reviews: IReview[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        total_score: number,
        number_of_reviews: number,
        product_id: string,
        ratings: IRatingScore,
        tags: string[],
        images: string[],
        most_recent_reviews: IReview[],
        most_helpful_reviews: IReview[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.total_score = total_score;
        this.number_of_reviews = number_of_reviews;
        this.product_id = product_id;
        this.ratings = ratings;
        this.tags = tags;
        this.images = images;
        this.most_recent_reviews = most_recent_reviews;
        this.most_helpful_reviews = most_helpful_reviews;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt
    }
}

export type ReviewSummaryWithId = WithId<ReviewSummary>;
export default ReviewSummary;
