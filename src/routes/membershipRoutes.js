import express from 'express';
import {
  joinClub,
  checkMembership,
  getMyMemberships,
  getClubMembers,
} from '../controllers/membershipController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/join', protect, joinClub);
router.get('/check/:clubId', protect, checkMembership);
router.get('/my', protect, getMyMemberships);
router.get('/club/:clubId', protect, authorize('clubManager', 'admin'), getClubMembers);

export default router;
