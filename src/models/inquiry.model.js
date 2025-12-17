import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },

    //Intrested Person
    inquirer: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },

    message: {
        type: String,
        required: true,
        maxLength: 1000
    },

    inquiryType: {
        type: String,
        enum: ['visit', 'info', 'general'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'closed'],
        default: 'pending'
    },

    //Owner response
    ownerResponse: {
        message: String,
        respondedAt: Date
    },
    preferredDate: {
        type: Date
    },
    preferredTime: {
        type: String
    },

}, { timestamps: true });

inquirySchema.index({ property: 1, 'inquirer.userId': 1, status: 1 });
const Inquiry = mongoose.model('Inquiry', inquirySchema)

export default Inquiry;