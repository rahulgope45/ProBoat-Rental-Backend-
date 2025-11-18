import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { uploaImages, deleteImage } from '../controllers/upload.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/', protectRoute, upload.array('images',10),uploaImages);
router.delete('/:publicId',protectRoute,deleteImage);

export default router;