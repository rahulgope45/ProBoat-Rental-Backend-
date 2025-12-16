import Review from "../models/review.model.js";
import Property from "../models/property.model.js";

// Add Review (Comment)
export const addReview = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { comment } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            property: propertyId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already commented on this property'
            });
        }

        // Create review
        const review = new Review({
            property: propertyId,
            user: req.user._id,
            comment
        });

        await review.save();

        // Populate user info for response
        await review.populate('user', 'fullName email');

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            review
        });

    } catch (error) {
        console.log('Error in addReview:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get Property Reviews
export const getPropertyReviews = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ property: propertyId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Review.countDocuments({ property: propertyId });

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            }
        });

    } catch (error) {
        console.log('Error in getPropertyReviews:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete Review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.log('Error in deleteReview:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};