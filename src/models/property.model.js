import mongoose from "mongoose";
import User from "./user.model";

//Property schema

const propertySchema = new mongoose.Schema(
    {
        category: {
            //Flat or Land or rental
            type: String,
            enum: ["Flat", "Land", "Rental"],
            required: true,

        },

        sellerName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },



        location: {
            country: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },

        images: [
            {
                type: Array,
                required: true,
            },
        ],

        price: {
            type: Number,
            required: true,
        },

        ratings: {
            average: { type: Number, default: 0 },
            totalReviews: { type: Number, default: 0 },
            required: true,
        },

        description: {
            type: String,
            required: true,
            maxlength: 200,
        },

        status: {
            type: String,
            enum: ["Available", "Rented", "Sold"],
            default: "Available",
        },




    },
    { timestamps: true }
);

const Property = mongoose.model("properties", propertySchema);
export default Property;