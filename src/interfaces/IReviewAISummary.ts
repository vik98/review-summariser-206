interface IReviewAISummary {
    no_of_reviews: number;
    summarised_description: string;
    important_keywords: string[];
    sentiment: string;
}

export default IReviewAISummary