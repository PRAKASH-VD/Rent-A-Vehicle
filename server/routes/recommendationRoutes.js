import express from 'express';
import { protect } from '../middleware/auth.js';
import { getPersonalizedRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

router.use(protect);
router.get('/personalized', getPersonalizedRecommendations);

export default router;