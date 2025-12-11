import express from 'express';
import {
  createClub,
  getClubs,
  getClubById,
  updateClubStatus,
  updateClub,

  getAllClubsAdmin,
  deleteClub
} from '../controllers/clubController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getClubs);
router.get('/:id', getClubById);

// Protected
router.post('/', protect, authorize('clubManager', 'admin'), createClub);
router.put('/:id', protect, authorize('clubManager', 'admin'), updateClub);


router.get('/admin/all', protect, authorize('admin', 'clubManager'), getAllClubsAdmin);

// Admin Only
router.put('/:id/status', protect, authorize('admin'), updateClubStatus);
router.delete('/:id', protect, authorize('admin'), deleteClub);

export default router;
