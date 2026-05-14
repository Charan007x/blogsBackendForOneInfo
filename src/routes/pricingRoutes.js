import express from 'express';
const router = express.Router();
import { getPricing } from '../controllers/pricingController.js';

router.get('/', getPricing);

export default router;