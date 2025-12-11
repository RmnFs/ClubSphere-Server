import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      ref: 'User',
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'pendingPayment'],
      default: 'active',
    },
    paymentId: {
      type: String, // Stripe Payment Intent ID
    },
    paymentCheck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'joinedAt', updatedAt: true },
  }
);

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;
