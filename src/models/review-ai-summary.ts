import { WithId } from 'mongodb';
import IReviewAISummary from '../interfaces/IReviewAISummary';

class ReviewAISummary implements IReviewAISummary {
    no_of_reviews: number;
    summarised_description: string;
    important_keywords: string[];
    sentiment: string;

    constructor(
        no_of_reviews: number,
        summarised_description: string,
        important_keywords: string[],
        sentiment: string,
    ) {
        this.important_keywords = important_keywords;
        this.no_of_reviews = no_of_reviews;
        this.sentiment = sentiment;
        this.summarised_description = summarised_description;
    }
}

export type ReviewAISummaryWithId = WithId<ReviewAISummary>;
export default ReviewAISummary;
