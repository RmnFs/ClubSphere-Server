import express from 'express';
import { syncUser, getUsers, updateUserRole, updateProfile, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', protect, syncUser); // Any authenticated user can sync themselves
router.put('/profile', protect, updateProfile); // User can update their own profile
router.get('/', protect, authorize('admin'), getUsers); // Admin only
router.put('/:id/role', protect, authorize('admin'), updateUserRole); // Admin can update role
router.delete('/:id', protect, authorize('admin'), deleteUser); // Admin can delete user

export default router;
