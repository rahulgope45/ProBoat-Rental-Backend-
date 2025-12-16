import express from 'express';
import {
    addReview,
    getPropertyReviews,
    deleteReview
} from '../controllers/review.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/property/:propertyId', getPropertyReviews);

// Protected routes
router.post('/property/:propertyId', protectRoute, addReview);
router.delete('/:reviewId', protectRoute, deleteReview);

export default router;