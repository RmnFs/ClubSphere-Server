import express from 'express';
import {
  getAdminStats,
  getManagerStats,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.get('/manager/stats', protect, authorize('admin', 'clubManager'), getManagerStats);

export default router;
