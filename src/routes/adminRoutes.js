import express from 'express';
const router = express.Router();
import { upload } from '../config/cloudinary.js';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
  setFeaturedBlog,
  login,
  registerUser,
  updatePassword,
} from '../controllers/adminController.js';
import { updatePricing } from '../controllers/pricingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/login', login);
router.post('/register', registerUser);

router.put('/password', protect, updatePassword);
router.put('/pricing', protect, updatePricing);

router.post('/blogs', protect, createBlog);
router.route('/blogs/:id').put(protect, updateBlog).delete(protect, deleteBlog);
router.put('/blogs/featured/:id', protect, setFeaturedBlog);
router.post('/upload', protect, upload.single('image'), uploadImage);

export default router;
