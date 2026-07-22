import { getReviewsForBook, getReviewsByUser, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";

export async function reviewRoutes (fastify) {
    // Public routes
    fastify.get('/', getReviewsForBook);
    fastify.get('/user/:userId', getReviewsByUser);

     // Protected routes
    fastify.post('/', { preHandler: authenticate }, createReview);
    fastify.put('/:id', { preHandler: authenticate }, updateReview);
    fastify.delete('/:id', { preHandler: authenticate }, deleteReview);
}