import express  from 'express';

import { createProperty, deleteProperty, updateProperty,getAllProperties,getPropertyById,getUserProperties } from '../controllers/property.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//Public Routes
router.get('/',getAllProperties);
router.get('/:id',getPropertyById);


//protectedRoutes
router.post('/',protectRoute,createProperty);
router.put('/:id',protectRoute,updateProperty);
router.delete('/:id',protectRoute,deleteProperty);
router.get('/user/my-properties',protectRoute,getUserProperties);

export default router;