import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
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
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    paymentId: {
      type: String, // Optional if free
    },
    paymentCheck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: { createdAt: 'registeredAt', updatedAt: true },
  }
);

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;
