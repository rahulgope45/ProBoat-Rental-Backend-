import express from 'express';
import {
  createInquiry,
  getOwnerInquiries,
  getUserInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiry.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/property/:propertyId', protectRoute, createInquiry);
router.get('/owner', protectRoute, getOwnerInquiries); // Get inquiries for properties you own
router.get('/user', protectRoute, getUserInquiries); // Get inquiries you sent
router.put('/:inquiryId/status', protectRoute, updateInquiryStatus);
router.delete('/:inquiryId', protectRoute, deleteInquiry);

export default router;