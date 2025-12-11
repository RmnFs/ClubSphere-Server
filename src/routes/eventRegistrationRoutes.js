import express from 'express';
import {
  registerEvent,
  checkRegistration,
  getMyRegistrations,
  getEventRegistrations,
} from '../controllers/eventRegistrationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', protect, registerEvent);
router.get('/check/:eventId', protect, checkRegistration);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, authorize('clubManager', 'admin'), getEventRegistrations);

export default router;
