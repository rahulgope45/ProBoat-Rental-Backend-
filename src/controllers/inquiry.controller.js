import Inquiry from "../models/inquiry.model.js";
import Property from "../models/property.model.js";

//Create Inquiry
export const createInquiry = async (req, res) =>{
    try {
        const {propertyId} = req.params;
        const { name,email,phone,message,inquiryType,preferredDate, preferredTime} =req.body;
        const property = await Property.findById(propertyId);
        if(!property){
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const existingInquiry = await Inquiry.findOne({
            property: propertyId,
            'inquirer.userId': req.user._id,
            status: 'pending'
        });

        if(existingInquiry){
            return res.status(400).json({
                success: false,
             message: 'You already have apending inquiry for this property'
            });
        }

         // Create inquiry
    const inquiry = new Inquiry({
      property: propertyId,
      inquirer: {
        userId: req.user._id,
        name: name || req.user.fullName,
        email: email || req.user.email,
        phone
      },
      message,
      inquiryType: inquiryType || 'general',
      preferredDate,
      preferredTime
    });

    await inquiry.save();

    // Populate property and user info
    await inquiry.populate('property', 'title address images');
    await inquiry.populate('inquirer.userId', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      inquiry
    });
    } catch (error) {
        console.log('Error in createInquiry:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }      
}

// Get Inquiries for Property Owner
export const getOwnerInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Find all properties owned by user
    const userProperties = await Property.find({ 'owner.userId': req.user._id }).select('_id');
    const propertyIds = userProperties.map(p => p._id);

    // Build query
    const query = { property: { $in: propertyIds } };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title address images listingType')
      .populate('inquirer.userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      inquiries,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalInquiries: total
      }
    });

  } catch (error) {
    console.log('Error in getOwnerInquiries:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get User's Inquiries (inquiries they sent)
export const getUserInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const inquiries = await Inquiry.find({ 'inquirer.userId': req.user._id })
      .populate('property', 'title address images owner')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Inquiry.countDocuments({ 'inquirer.userId': req.user._id });

    res.status(200).json({
      success: true,
      inquiries,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalInquiries: total
      }
    });

  } catch (error) {
    console.log('Error in getUserInquiries:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update Inquiry Status (Owner only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status, ownerResponse } = req.body;

    const inquiry = await Inquiry.findById(inquiryId).populate('property');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user is property owner
    if (inquiry.property.owner.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    inquiry.status = status || inquiry.status;
    
    if (ownerResponse) {
      inquiry.ownerResponse = {
        message: ownerResponse,
        respondedAt: new Date()
      };
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry
    });

  } catch (error) {
    console.log('Error in updateInquiryStatus:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;

    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Only inquirer can delete their inquiry
    if (inquiry.inquirer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await Inquiry.findByIdAndDelete(inquiryId);

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });

  } catch (error) {
    console.log('Error in deleteInquiry:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};