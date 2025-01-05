import express from 'express';
import { getAdminStats } from '../controllers/dashboardController.js';

const router = express.Router();
router.get('/',getAdminStats);
export default router;