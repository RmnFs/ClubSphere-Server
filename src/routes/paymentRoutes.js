import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getAllPayments,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/all', protect, authorize('admin', 'clubManager'), getAllPayments);

export default router;
