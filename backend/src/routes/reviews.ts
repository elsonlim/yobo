import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// Create a new review (requires authentication)
router.post('/', reviewController.ensureAuthenticated, reviewController.createReview);

// Get all reviews (with potential query params)
router.get('/', reviewController.getAllReviews);

// Get best-rated reviews
router.get('/best', reviewController.getBestReviews);

// Get worst-rated yobo reviews
router.get('/worst', reviewController.getWorstYoboReviews);

// Get a specific review by ID
router.get('/:id', reviewController.getReviewById);

// Update a review by ID (requires authentication, user must be author)
router.put('/:id', reviewController.ensureAuthenticated, reviewController.ensureAuthor, reviewController.updateReview);

// Delete a review by ID (requires authentication, user must be author)
router.delete('/:id', reviewController.ensureAuthenticated, reviewController.ensureAuthor, reviewController.deleteReview);

export default router;
