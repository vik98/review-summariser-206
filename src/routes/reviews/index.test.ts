import request from 'supertest';
import App from '../../app';
import { ReviewWithId } from '../../models/review';
import { ObjectId } from 'mongodb';
import { Reviews } from '../../schemas/review';
import { NextFunction, Request, Response } from 'express';
import { privateDecrypt } from 'crypto';

const appInstance = new App();

// beforeAll(async () => {
//     try {
//         await Reviews.drop()
//     } catch (error) {
//         console.log(error)
//     }
// })

let productId: string = 'db956697-1d24-4eeb-954c-1cd3dd674b40'

describe('GET /product/:productId/reviews', () => {
    it('responds with a json message', async () => {
        const response = await request(appInstance.app)
            .get(`/product/${productId}/reviews`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

let id: string;

describe('POST /', () => {
    it('responds with an invalid message', async () => {
        const response = await request(appInstance.app)
            .post(`/product/${productId}/reviews`)
            .set('Accept', 'application/json')
            .send({ title: 'hello' })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(response.status).toBe(422);
        expect(response.body).toBeInstanceOf(Object);
    });

    it('responds with an exception', async () => {
        const response = await request(appInstance.app)
            .post(`/product/${productId}/reviews`)
            .set('Accept', 'application/json')
            .send({
                "description": "TEsting a new review of the product.",
                "image": ["image-url-1.jpg", "image-url-2.jpg"],
                "tags": ["tag1", "tag2"],
                "score": 4,
                "product_id": "db956697-1d24-4eeb-954c-1cd3dd674b41",
                "is_verified": true,
                "title": "Review Title",
                "user_id": "8e60a79d-49b2-4e15-92f8-7ad2ed416b01",
                "location": "New York, USA"
            }
            )
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.message).toBe('ProductID in Req and URL do not match')


    });

    it('responds with an valid review', async () => {
        const response = await request(appInstance.app)
            .post(`/product/${productId}/reviews`)
            .set('Accept', 'application/json')
            .send({
                description: "Testing a new review of the product.",
                image: ["image-url-1.jpg", "image-url-2.jpg"],
                tags: ["tag1", "tag2"],
                score: 4,
                product_id: "db956697-1d24-4eeb-954c-1cd3dd674b40",
                is_verified: true,
                title: "Review Title",
                user_id: "8e60a79d-49b2-4e15-92f8-7ad2ed416b01",
                location: "New York, USA"
            })
            .expect('Content-Type', /json/)
            .expect(201);

        const review: ReviewWithId = response.body;
        id = review._id.toString()
        expect(review).toHaveProperty('description');
        expect(review).toHaveProperty('image');
        expect(review).toHaveProperty('comment');
        expect(review).toHaveProperty('tags');
        expect(review).toHaveProperty('score');
        expect(review).toHaveProperty('helpful');
        expect(review).toHaveProperty('product_id');
        expect(review).toHaveProperty('is_verified');
        expect(review).toHaveProperty('createdAt');
        expect(review).toHaveProperty('updatedAt');
        expect(review).toHaveProperty('title');
        expect(review).toHaveProperty('user_id');
        expect(review).toHaveProperty('location');

        expect(typeof review.description).toBe('string');
        expect(Array.isArray(review.image)).toBe(true);
        expect(Array.isArray(review.comment)).toBe(true);
        expect(Array.isArray(review.tags)).toBe(true);
        expect(typeof review.score).toBe('number');
        expect(typeof review.helpful).toBe('number');
        expect(typeof review.product_id).toBe('string');
        expect(typeof review.is_verified).toBe('boolean');
        expect(typeof review.createdAt).toBe('string');
        expect(typeof review.updatedAt).toBe('string');
        expect(typeof review.title).toBe('string');
        expect(typeof review.user_id).toBe('string');
        expect(typeof review.location).toBe('string');

    });
});

describe('GET /:id', () => {
    it('responds with a json message', async () => {
        id = id ?? '64d156d26da2fa606a1d293c'
        const response = await request(appInstance.app)
            .get(`/product/${productId}/reviews/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        const review: ReviewWithId = response.body;

        expect(review._id).toBe(id)

    });

    it('responds with a not found error', async () => {
        const response = await request(appInstance.app)
            .get(`/product/${productId}/reviews/64d1e4daf01002960c283f12`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.message).toBe('Review ID Not Found')

    });
});

describe('PUT /:id', () => {
    it('responds with a validation error', async () => {
        const response = await request(appInstance.app)
            .put(`/product/${productId}/reviews/${new ObjectId().toString()}`)
            .set('Accept', 'application/json')
            .send({
                "description": "This is an updated review of the product.",
                "comment": [
                    {
                        "description": "This is a comment on the review.",
                        "createdAt": new Date(),
                        "updatedAt": new Date(),
                        "title": "Comment Title",
                        "user_id": "b3ab61e1-1e87-4c08-bcb6-9f2d8b17d0c9"
                    }
                ],
                "tags": ["tag1", "tag2"],
                "score": 4,
                "helpful": 10,
                "is_verified": true,
                "title": "Review Title",
                "location": "New York, USA"
            })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.message).toBe('Database Error: Update Failed')

    });

    it('responds with a not found error', async () => {
        await request(appInstance.app)
            .put(`/product/${productId}/reviews/${new ObjectId().toString()}`)
            .set('Accept', 'application/json')
            .send({
                "description": "This is an updated review of the product.",
                "tags": ["tag1", "tag2"],
                "score": 4,
                "helpful": 10,
                "is_verified": true,
                "title": "Review Title",
                "location": "New York, USA"
            })
            .expect('Content-Type', /json/)
            .expect(422);

    });

    it('updates and responds with a valid review', async () => {
        id = id ?? '64d156d26da2fa606a1d293c'

        const response = await request(appInstance.app)
            .put(`/product/${productId}/reviews/${id}`)
            .set('Accept', 'application/json')
            .send({
                "description": "This is an updated review of the product.",
                "tags": ["tag1", "tag2"],
                "comment": [
                    {
                        "description": "This is a comment on the review.",
                        "createdAt": new Date(),
                        "updatedAt": new Date(),
                        "title": "Comment Title",
                        "user_id": "b3ab61e1-1e87-4c08-bcb6-9f2d8b17d0c9"
                    }
                ],
                "score": 4,
                "helpful": 10,
                "is_verified": true,
                "title": "Review Title",
                "location": "New York, USA"
            })
            .expect('Content-Type', /json/)
            .expect(200);

        const review: ReviewWithId = response.body;

        expect(review.description).toBe('This is an updated review of the product.')

        expect(review).toHaveProperty('_id');
        expect(review).toHaveProperty('image');
        expect(review).toHaveProperty('comment');
        expect(review).toHaveProperty('tags');
        expect(review).toHaveProperty('score');
        expect(review).toHaveProperty('helpful');
        expect(review).toHaveProperty('product_id');
        expect(review).toHaveProperty('is_verified');
        expect(review).toHaveProperty('createdAt');
        expect(review).toHaveProperty('updatedAt');
        expect(review).toHaveProperty('title');
        expect(review).toHaveProperty('user_id');
        expect(review).toHaveProperty('location');

    });

})

describe('DELETE /:id', () => {
    it('responds with a not found error', async () => {
        const response = await request(appInstance.app)
            .delete(`/product/${productId}/reviews/${new ObjectId().toString()}`)
            .expect(404);

        expect(response.body.message).toBe('Database Error: Delete Failed')

    });

    it('updates and responds with a valid review', async () => {
        const response = await request(appInstance.app)
            .delete(`/product/${productId}/reviews/${id}`)
            .expect(204);

        expect(response.status).toBe(204)

    });

})