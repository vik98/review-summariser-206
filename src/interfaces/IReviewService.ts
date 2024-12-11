import { ObjectId } from "mongodb";
import Review, { ReviewWithId } from "../models/review"
import { PutReview } from "../schemas/review";
import { ReviewSummaryWithId } from "../models/review-summary";
import { SORT_BY, SORT_ORDER } from "../models/filter-by";

interface IReviewService {
    findAllReviews: (productId: string, page: number, sortBy: SORT_BY | undefined, sortOrder: SORT_ORDER | undefined) => Promise<ReviewWithId[]>;
    findAllReviewsWithoutPagination: (productId: string, sortBy: SORT_BY | undefined, sortOrder: SORT_ORDER | undefined) => Promise<ReviewWithId[]>;
    findOneReview: (productId: string, reviewId: string) => Promise<ReviewWithId | null>;
    insertOneReview: (productId: string, body: Review) => Promise<ObjectId>;
    updateOneReview: (productId: string, reviewId: string, body: PutReview) => Promise<ReviewWithId>;
    deleteOneReview: (productId: string, id: string) => Promise<any>;
    getReviewSummary: (productId: string) => Promise<ReviewSummaryWithId | null>;
}

export default IReviewService