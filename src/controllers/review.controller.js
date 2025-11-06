import Review from "../models/review.model.js";
import Property from "../models/property.model.js";

//Add review
export const addReview = async(req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

//Get Property Reviews
export const getPropertyReviews = async (req,res) =>{
    try {
        const {propertyId} = req.params;
        const { page= 1, limit = 10}= req.query;
    } catch (error) {
        
    }
}

//update Review
export const updateReview = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

//delete review
export const deleteReview = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

//Helper function to update property rattings
async function updatePropertyRatings(propertyId) {
    
}



