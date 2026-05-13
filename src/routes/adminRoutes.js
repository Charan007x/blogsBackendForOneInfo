import express from 'express';
const router = express.Router();
import { upload } from '../config/cloudinary.js';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
  setFeaturedBlog,
} from '../controllers/adminController.js';

router.post('/blogs', createBlog);
router.route('/blogs/:id').put(updateBlog).delete(deleteBlog);
router.put('/blogs/featured/:id', setFeaturedBlog);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
