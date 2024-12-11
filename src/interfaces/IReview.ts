import IComment from './IComment';

interface IReview {
    description: string;
    image: string[];
    comment: IComment[];
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
}

export default IReview;