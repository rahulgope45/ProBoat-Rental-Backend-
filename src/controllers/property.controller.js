import Property from "../models/property.model.js";
import Review from "../models/review.model.js";
import cloudinary from "../lib/cloudinary.js";


//Controller of Listing property

export const createProperty = async (req, res) =>{
    try {
        const{
            title,
            description,
            propertyType,
            listingType,
            price,
            address,
            location,
            specifications,
            amenities,
            images,
            owner

        } = req.body;

        //Validation
        if(!title || !description || !propertyType || !listingType || !price ){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'

            });
        }
        if(!images || images.length === 0){
            return res.status(400).json({
                success: false,
                message: 'Please uplaod at least one image'
            });
        }

        //Creating a property

        const property = new Property({
            title,
            description,
            propertyType,
            listingType,
            price,
            address,location,
            specifications,
            amenities,
            images,
            owner:{
                userId: req.user._id,
                name: owner?.name || req.user.fullName,
                phone: owner?.phone,
                email: owner?.email || req.user.email
            }
        });

        await property.save();

        res.status(200).json({
            success: true,
            message: 'Property created succesfully',
            property
        });


    } catch (error) {
        console.log('Error in creating Property:', error.message);
        res.status(500).json({
            success: 'false',
            message: 'Internal server error'
        })
        
    }
}

//controller for get all properties
export const getAllProperties =async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

//Get Property by id
export const getPropertyById =async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

//Update Property
export const updateProperty =async(req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

//Delete Property
export const deleteProperty =async(req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

//Get Users Properties
export const getUserProperties = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}