import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected
router.post('/', protect, authorize('clubManager', 'admin'), createEvent);
router.put('/:id', protect, authorize('clubManager', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('clubManager', 'admin'), deleteEvent);

export default router;
