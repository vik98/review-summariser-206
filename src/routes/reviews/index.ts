import { Router } from 'express';
import { validateRequest } from '../../middleware/validators';
import { ReviewSchema, PutReviewSchema, PostReviewSchema } from '../../schemas/review';
import { ParamsWithIdSchema, ParamsWithProductIdRevewIdSchema, ParamsWithProductIdSchema } from '../../schemas/params-with-id';
import ReviewService from '../../service/ReviewService';
import ReviewController from '../../controllers/ReviewController';

class ReviewRouter {
    private router: Router;

    constructor(private reviewService: ReviewService) {
        this.router = Router({ mergeParams: true });

        const reviewController = new ReviewController(reviewService);

        this.router.get("/", reviewController.findAll);
        this.router.post("/", validateRequest({ params: ParamsWithProductIdSchema, body: PostReviewSchema }), reviewController.createOne);
        this.router.get("/summary", validateRequest({ params: ParamsWithProductIdSchema }), reviewController.getSummary);
        this.router.get("/:reviewId", validateRequest({ params: ParamsWithProductIdRevewIdSchema }), reviewController.findOne);
        this.router.put("/:reviewId", validateRequest({ params: ParamsWithProductIdRevewIdSchema, body: PutReviewSchema }), reviewController.updateOne);
        this.router.delete("/:reviewId", validateRequest({ params: ParamsWithProductIdRevewIdSchema }), reviewController.deleteOne);
    }

    getRouter() {
        return this.router;
    }
}

export default ReviewRouter;
