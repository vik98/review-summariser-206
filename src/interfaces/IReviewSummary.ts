import IRatingScore from './IRatingScore';
import IReview from './IReview';

interface IReviewSummary {
    total_score: number;
    number_of_reviews: number;
    product_id: string;
    ratings: IRatingScore;
    tags: string[];
    images: string[];
    most_recent_reviews: IReview[];
    most_helpful_reviews: IReview[];
    createdAt: Date,
    updatedAt: Date
}

export default IReviewSummary