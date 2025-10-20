import mongoose from "mongoose";

//Property schema

const propertySchema = new mongoose.Schema(
    {
        category: {
            //Flat or Land or rental
            type: String,
            enum: ["Flat", "Land" , "Rental" ],
            required: true,

        },

        sellerName: {
            type: String,
            required: true,
        },

        sellerNumber: {
            type: String,
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

        images: {
            type: Array,
            required: true,
        },

        price: {
            type: String,
            required: true,
        },

        ratings: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        }




    },
    { timestamps: true }
);

const Property = mongoose.model("properties", propertySchema);
export default Property;