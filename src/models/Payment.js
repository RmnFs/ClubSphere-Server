import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    type: {
      type: String,
      enum: ['membership', 'event'],
      required: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true, // e.g., 'succeeded', 'pending'
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
