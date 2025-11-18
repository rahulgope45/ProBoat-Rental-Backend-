import Property from "../models/property.model.js";
import Review from "../models/review.model.js";
import cloudinary from "../lib/cloudinary.js";


//Controller of Listing property

export const createProperty = async (req, res) => {
    try {
        const {
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
        if (!title || !description || !propertyType || !listingType || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'

            });
        }
        if (!images || images.length === 0) {
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
            address, location,
            specifications,
            amenities,
            images,
            owner: {
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
export const getAllProperties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            propertyType,
            listingType,
            city,
            state,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            furnished,
            sortBy = 'createdAt',
            order = 'desc',
            search
        } = req.query;


        //Query
        if (propertyType) query.propertyType = propertyType;

        if (listingType) query.listingType = listingType;
        if (city) query['address.city'] = new RegExp(city, 'i');
        if (state) query['address.state'] = new RegExp(state, 'i');
        if (bedrooms) query['sepecifiaction.bedrooms'] = { $gte: Number(bedrooms) };
        if (bathrooms) query['sepecifiaction.bathrooms'] = { $gte: Number(bathrooms) };
        if (furnished) query['specifications.furnished'] = furnished;

        //Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$gte = Number(maxPrice);
        }

        //sorting
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        // Pagination
        const skip = (page - 1) * limit;

        const properties = await Property.find(query)
            .sort(sortOptions)
            .limit(Number(limit))
            .skip(skip)
            .populate('owner.userId', 'fullName email')
            .select('-__v');

        const total = await Property.countDocuments(query);

        res.status(200).json({
            success: true,
            properties,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProperties: total,
                hasMore: skip + properties.length < total
            }
        });


    } catch (error) {
        console.log('Error in getAllProperties:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });

    }
}

//Get Property by id
export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id)
            .populate('owner.userId', 'fullName email');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        //increment views
        property.views += 1
        await property.save()

        res.status(200).json({
            success: false,
            property
        })

    } catch (error) {
        console.log('Error in getPropertyById:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });

    }
}

//Update Property
export const updateProperty = async (req, res) => {
    try {
        const {id} = req.params;

        const property = await Property.findById(id);

        if(!property){
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            })
        }

        //if not owner
        if(property.owner.userId.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: 'Not Authorized to update this property'
            });
        }

        //If updating images ,delete old ones from cloudinary
        if(req.body.images && req.body.imagesToDelete){
            const deletePromises = req.body.imagesToDelete.map(publicId => 
                cloudinary.uploader.destroy(publicId)
            );
            await Promise.all(deletePromises);
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            {...req.body},
            {new: true, runValidators: true}
        );

        res.status(200).json({
            success: true,
            message: 'property updated successfully',
            property: updateProperty
        });

    } catch (error) {

        console.log('Error in Updating Property', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server erorr'
        });
    }
}

//Delete Property
export const deleteProperty = async (req, res) => {
    try {

    } catch (error) {

    }
}

//Get Users Properties
export const getUserProperties = async (req, res) => {
    try {

    } catch (error) {

    }
}