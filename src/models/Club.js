import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String, // URL
    },
    membershipFee: {
      type: Number,
      default: 0,
    },
    membersCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    managerEmail: {
      type: String,
      required: true,
      ref: 'User', // Loosely coupled by email, or could use ObjectId
    },
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model('Club', clubSchema);

export default Club;
