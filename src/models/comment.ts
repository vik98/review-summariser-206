import IComment from '../interfaces/IComment';
import { WithId } from 'mongodb';


class Comment implements IComment {
    description: string;
    createdAt: Date;
    updatedAt: Date;
    user_id: string;
    title: string;

    constructor(_id: string, createdAt: Date, updateAt: Date, description: string, title: string, user_id: string) {
        this.description = description;
        this.title = title;
        this.user_id = user_id;
        this.createdAt = createdAt;
        this.updatedAt = updateAt;
    }
}

export default Comment;
export type CommentWithId = WithId<Comment>;


