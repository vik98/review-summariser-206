import { InsertOneResult, ObjectId, Sort } from "mongodb";
import IReviewService from "../interfaces/IReviewService";
import Review, { ReviewWithId } from "../models/review";
import { PutReview, Reviews } from "../schemas/review";
import { ReviewSummaries } from "../schemas/review-summary";
import ReviewSummary, { ReviewSummaryWithId } from "../models/review-summary";
import { SORT_BY, SORT_ORDER } from "../models/filter-by";
import logger from "../utils/logger";
import { DatabaseError } from "../exceptions/database-error";
import { OperationError } from "../exceptions/operation-error";
import { NotFoundError } from "../exceptions/not-found-error";

class ReviewService implements IReviewService {
    // To retrieve all the reviews
    async findAllReviews(productId: string, page: number, sortBy: SORT_BY | undefined, sortOrder: SORT_ORDER | undefined): Promise<ReviewWithId[]> {
        try {
            const itemsPerPage = parseInt(process.env.ITEMS_PER_PAGE as string) || 3;

            const skip = (page - 1) * itemsPerPage;

            const sortOptions: Sort = {};

            switch (sortBy) {
                case SORT_BY.SCORE:
                    sortOptions[SORT_BY.SCORE] = sortOrder === SORT_ORDER.DESC ? -1 : 1;
                    break;
                case SORT_BY.CREATEDAT:
                    sortOptions[SORT_BY.CREATEDAT] = sortOrder === SORT_ORDER.DESC ? -1 : 1;
                    break;
                default:
                    sortOptions[SORT_BY.HELPFUL] = -1;
                    break;
            }

            const result = await Reviews.find({ product_id: productId })
                .sort(sortOptions)
                .skip(skip)
                .limit(itemsPerPage);

            const reviews = await result.toArray();

            return reviews;

        } catch (error) {
            logger.error(`Error in findAllReviews: ${error}`);

            throw new DatabaseError(`Database Error`);

        }
    }

    async findAllReviewsWithoutPagination(productId: string, sortBy: SORT_BY | undefined, sortOrder: SORT_ORDER | undefined): Promise<ReviewWithId[]> {
        try {

            const sortOptions: Sort = {};

            switch (sortBy) {
                case SORT_BY.SCORE:
                    sortOptions[SORT_BY.SCORE] = sortOrder === SORT_ORDER.DESC ? -1 : 1;
                    break;
                case SORT_BY.CREATEDAT:
                    sortOptions[SORT_BY.CREATEDAT] = sortOrder === SORT_ORDER.DESC ? -1 : 1;
                    break;
                default:
                    sortOptions[SORT_BY.HELPFUL] = -1;
                    break;
            }

            const result = await Reviews.find({ product_id: productId })
                .sort(sortOptions)

            const reviews = await result.toArray();

            return reviews;

        } catch (error) {
            logger.error(`Error in findAllReviews: ${error}`);

            throw new DatabaseError(`Database Error`);

        }
    }

    // To retrieve a single review
    async findOneReview(productId: string, reviewId: string): Promise<ReviewWithId | null> {
        try {
            const result = await Reviews.findOne({ product_id: productId, _id: new ObjectId(reviewId) });

            return result;

        } catch (error) {
            logger.error(`Error in findOneReview: ${error}`);
            throw new DatabaseError(`Database Error`);

        }
    }

    // Create a new review in DB
    async insertOneReview(productId: string, body: Review): Promise<ObjectId> {

        try {
            const result = await Reviews.insertOne(body);

            if (!result.acknowledged) throw new OperationError("Insertion Failed")

            const reviewSummary = await ReviewSummaries.findOne({ product_id: productId })

            if (!reviewSummary) {

                const reviewSummaryBody: ReviewSummary = {
                    product_id: productId,
                    total_score: 0,
                    number_of_reviews: 0,
                    ratings: {},
                    tags: body.tags,
                    images: body.image,
                    most_helpful_reviews: [],
                    most_recent_reviews: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }


                const insertedReviewSumamry: InsertOneResult<ReviewSummary> = await ReviewSummaries.insertOne(reviewSummaryBody)

                if (!insertedReviewSumamry.acknowledged) throw new OperationError("Insertion in Review Summary Failed")
            }

            if (!this.updatePostReviewSummary(productId, body.score, 1, this.mapNumberToString(body.score), this.mapNumberToString(body.score))) throw new OperationError("Database Error")

            return result.insertedId

        } catch (error: any) {
            logger.error(`Error in insertOneReview: ${error}`);
            throw new DatabaseError(`Database Error: ${error.message}`);

        }
    };

    // Update a review in DB
    async updateOneReview(productId: string, reviewId: string, body: PutReview): Promise<ReviewWithId> {

        try {
            const currentExistingReview: ReviewWithId | null = await Reviews.findOne({ _id: new ObjectId(reviewId), product_id: productId })

            if (!currentExistingReview) throw new Error("Update Failed")

            const updatedBody = {
                ...body,
                updatedAt: new Date(),
            }

            const result = await Reviews.findOneAndUpdate({ _id: new ObjectId(reviewId), product_id: productId }, { $set: updatedBody }, { returnDocument: 'after' })

            if (!result.value) throw new Error("Update Failed")

            if (!this.updatePutReviewSummary(productId, updatedBody.score - currentExistingReview.score, 0, this.mapNumberToString(currentExistingReview.score), this.mapNumberToString(updatedBody.score))) throw new DatabaseError("Database Error")

            return result.value

        } catch (error: any) {
            logger.error(`Error in updateOneReview: ${error}`);
            throw new DatabaseError(`Database Error: ${error.message}`);

        }

    };

    // Delete a review in DB
    async deleteOneReview(productId: string, reviewId: string): Promise<any> {

        try {

            const currentExistingReview: ReviewWithId | null = await Reviews.findOne({ _id: new ObjectId(reviewId), product_id: productId })

            if (!currentExistingReview) throw new OperationError("Delete Failed")

            const result = await Reviews.findOneAndDelete({ _id: new ObjectId(reviewId), product_id: productId });

            if (!result.value) throw new OperationError("Deletion Failed")

            if (!this.updateDeleteReviewSummary(productId, currentExistingReview.score, 1, this.mapNumberToString(currentExistingReview.score), this.mapNumberToString(currentExistingReview.score))) throw new DatabaseError("Database Error")

            return result

        } catch (error: any) {
            logger.error(`Error in deleteOneReview: ${error}`);
            throw new DatabaseError(`Database Error: ${error.message}`);

        }
    }

    // Get Summary of the Review
    async getReviewSummary(productId: string): Promise<ReviewSummaryWithId | null> {

        try {
            const reviewSummary = await ReviewSummaries.findOne({ product_id: productId });

            if (reviewSummary) {
                reviewSummary.most_helpful_reviews = await this.findAllReviews(productId, 1, SORT_BY.HELPFUL, SORT_ORDER.ASC)
                reviewSummary.most_recent_reviews = await this.findAllReviews(productId, 1, SORT_BY.CREATEDAT, SORT_ORDER.ASC)
            }

            return reviewSummary;
        } catch (error: any) {
            logger.error(`Error in getReviewSummary: ${error}`);
            throw new DatabaseError(`Database Error: ${error.message}`);
        }
    }

    private async updatePutReviewSummary(productId: string, score: number, number_of_reviews: number, oldRating: string, newRating: string): Promise<Boolean> {

        const currentReviewSummary = await ReviewSummaries.findOne({ product_id: productId });

        if (!currentReviewSummary) throw new NotFoundError("ReviewSummary Not Found")

        currentReviewSummary.total_score += score;
        currentReviewSummary.number_of_reviews += number_of_reviews;

        if (!currentReviewSummary.ratings[oldRating]) {
            currentReviewSummary.ratings[oldRating] = 1
        }
        currentReviewSummary.ratings[oldRating] -= 1;

        if (!currentReviewSummary.ratings[newRating]) {
            currentReviewSummary.ratings[newRating] = 0
        }
        currentReviewSummary.ratings[newRating] += 1;

        const updatedReviewSummary = await ReviewSummaries.findOneAndUpdate({ product_id: productId }, { $set: currentReviewSummary }, { returnDocument: 'after' })

        if (!updatedReviewSummary.value) return false;

        return true;

    }

    private async updatePostReviewSummary(productId: string, score: number, number_of_reviews: number, oldRating: string, newRating: string): Promise<Boolean> {

        const currentReviewSummary = await ReviewSummaries.findOne({ product_id: productId });

        if (!currentReviewSummary) throw new NotFoundError("ReviewSummary Not Found")

        currentReviewSummary.total_score += score;
        currentReviewSummary.number_of_reviews += number_of_reviews;

        if (!currentReviewSummary.ratings[newRating]) {
            currentReviewSummary.ratings[newRating] = 0
        }
        currentReviewSummary.ratings[newRating] += 1;

        const updatedReviewSummary = await ReviewSummaries.findOneAndUpdate({ product_id: productId }, { $set: currentReviewSummary }, { returnDocument: 'after' })

        if (!updatedReviewSummary.value) return false;

        return true;

    }

    private async updateDeleteReviewSummary(productId: string, score: number, number_of_reviews: number, oldRating: string, newRating: string): Promise<Boolean> {

        const currentReviewSummary = await ReviewSummaries.findOne({ product_id: productId });

        if (!currentReviewSummary) throw new NotFoundError("ReviewSummary Not Found")

        currentReviewSummary.total_score -= score;
        currentReviewSummary.number_of_reviews -= number_of_reviews;

        if (!currentReviewSummary.ratings[oldRating]) {
            currentReviewSummary.ratings[oldRating] = 1
        }
        currentReviewSummary.ratings[oldRating] -= 1;

        const updatedReviewSummary = await ReviewSummaries.findOneAndUpdate({ product_id: productId }, { $set: currentReviewSummary }, { returnDocument: 'after' })

        if (!updatedReviewSummary.value) return false;

        return true;

    }

    private mapNumberToString(number: number): string {
        switch (number) {
            case 0:
                return "zero";
            case 1:
                return "one";
            case 2:
                return "two";
            case 3:
                return "three";
            case 4:
                return "four";
            default:
                return "five";
        }
    }

}

export default ReviewService;