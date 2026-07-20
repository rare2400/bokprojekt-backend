import { Review } from '../models/Review.js';
import { requireOwnership } from '../middleware/auth.js';

// GET /reviews - Get all reviews
export async function getReviewsForBook(request, reply) {

    // Get the bookId from query parameters
    const { bookId } = request.query;

    if (!bookId) {
        return reply.code(400).send({ error: 'Bok ID krävs som parameter' });
    }

    // Fetch reviews for the specified bookId, populate user information, and sort by creation date
    try {
        const reviews = await Review.find({ bookId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        return reply.send(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return reply.code(500).send({ error: "Serverfel vid hämtning av recensioner" });
    }
}

// GET /reviews/user/:userId - Get all reviews by a specific user
export async function getReviewsByUser(request, reply) {
    const { userId } = request.params;

    // Fetch reviews for the specified userId and sort by creation date
    try {
        const reviews = await Review.find({ userId })
            .sort({ createdAt: -1 });

        return reply.send(reviews);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return reply.code(500).send({ error: "Serverfel vid hämtning av användarrecensioner" });
    }
}

// POST /reviews - Create a new review
export async function createReview(request, reply) {
    const { bookId, rating, comment } = request.body;
    const userId = request.user.id;

    // Validate input
    if (!bookId || !rating) {
        return reply.code(400).send({ error: 'Bok ID och betyg krävs' });
    }

    if (rating < 1 || rating > 5) {
        return reply.code(400).send({ error: 'Betyg måste vara mellan 1 och 5' });
    }

    // Create and save the new review
    try {
        const newReview = new Review({
            bookId,
            userId,
            rating,
            comment,
        });

        await newReview.save();

        return reply.code(201).send(newReview);
    } catch (error) {
        console.error("Error creating review:", error);
        return reply.code(500).send({ error: "Serverfel vid skapande av recension" });
    }
}

// PUT /reviews/:id - Update a review
export async function updateReview(request, reply) {
    const { id } = request.params;
    const { rating, comment } = request.body;

    // Validate input
    if (rating !== undefined && (rating < 1 || rating > 5)) {
        return reply.code(400).send({ error: 'Betyg måste vara mellan 1 och 5' });
    }

    try {
        const review = await Review.findById(id);

        if (!review) {
            return reply.code(404).send({ error: 'Recension hittades inte' });
        }

        // Check ownership
        if (!requireOwnership(review.userId, request)) {
            return reply.code(403).send({ error: 'Du har inte behörighet att uppdatera denna recension' });
        }

        // Update the review fields if provided
        if (rating !== undefined) {
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        return reply.send(review);
    } catch (error) {
        console.error("Error updating review:", error);
        return reply.status(500).send({ error: "Serverfel vid uppdatering av recension" });
    }
}

// DELETE /reviews/:id - Delete a review
export async function deleteReview(request, reply) {
    const { id } = request.params;

    try {
        // Find the review by ID
        const review = await Review.findById(id);

        if (!review) {
            return reply.code(404).send({ error: 'Recension hittades inte' });
        }

        // Check ownership
        if (!requireOwnership(review.userId, request)) {
            return reply.code(403).send({ error: 'Du har inte behörighet att ta bort denna recension' });
        }

        await review.deleteOne();
        return reply.code(204).send();
    } catch (error) {
        console.error("Error deleting review:", error);
        return reply.code(500).send({ error: "Serverfel vid borttagning av recension" });
    }
}