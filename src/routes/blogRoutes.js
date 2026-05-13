import express from 'express';
const router = express.Router();
import { getBlogs, getBlogBySlug } from '../controllers/blogController.js';

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
