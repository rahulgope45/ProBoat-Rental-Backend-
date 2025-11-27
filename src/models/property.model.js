import mongoose from "mongoose";
import User from "./user.model.js";

//Property schema

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required:true,
            trim: true
        },

        description: {
            type: String,
            required:true,
            
        },

        propertyType: {
            type: String,
            required:true,
            enum: ['house', 'apartment', 'villa', 'land', 'commercial', 'office'],
        },

        listingType: {
            type: String,
            required:true,
            enum: ['rent', 'sale']
        },

        price: {
            type: Number,
            required:true,
            default: 'INR'
        },

        address: {
            
            street: {type: String},
            area: {type: String},
            city: {type: String, required:true},
            state: {type: String, required:true},
            country: {type: String, default:"India"},
            zipCode: String

        },

        location: {
            type:{
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }

        },
        //Property specifiactions
        specifications: {
            bedrooms: Number,
            bathrooms: Number,
            area: Number,
            furnished: {
                type: String,
                enum: [ 'fully-furnished', 'semi-furnished', 'unfurnished']
            },
            parking: Number,
            floor: Number,
            totalFloors: Number
        },
        amenities:[{
            type: String,
            enum: [
                'gym', 'pool', 'garden', 'security', 'lift', 'power-backup','internet',
                'air-condioning','heating','balcony', 'terrace'
            ]
        }],
        //images
        images: [{
            url: {
                type:String,
                required:true
            },
            publicId: {
                type:String,
                required:true
            },
            isPrimary: {
                type: Boolean,
                default:false
            }
        }],


        //Agent Details
        owner: {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: String,
            phone: String,
            email: String,
            type: {
                type: String,
                enum: ['owner', 'agent', 'builder'],
                default: 'owner'
            }
        },

        rattings:{
            average:{
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            count: {
                type:Number,
                default: 0
            }
        },
        status: {
            type: String,
            enum: ['active', 'sold', 'rented', 'pending', 'inactive'],
            default: 'active'
        },
        views: {
            type: Number,
            default: 0
        },
        postedDate:{
            type: Date,
            default: Date.now
        },
        lastUpdated:{
            type: Date,
            default: Date.now
        }
        

    },
    { timestamps: true }
);

//Indexes for search optimization
propertySchema.index({title: 'text',description:'text'});
propertySchema.index({'address.city':1,'address.state':1});
propertySchema.index({price: 1});
propertySchema.index({propertyType:1, listingType:1})

const Property = mongoose.model("properties", propertySchema);
export default Property;