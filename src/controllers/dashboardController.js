import User from '../models/User.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Membership from '../models/Membership.js';
import Payment from '../models/Payment.js';

// @desc    Get Admin Stats
// @route   GET /api/dashboard/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClubs = await Club.countDocuments();
    const approvedClubs = await Club.countDocuments({ status: 'approved' });
    const pendingClubs = await Club.countDocuments({ status: 'pending' });
    const rejectedClubs = await Club.countDocuments({ status: 'rejected' });
    const totalMemberships = await Membership.countDocuments({ status: 'active' });
    const totalEvents = await Event.countDocuments();
    
    // Aggregation for total payments (amount)
    const payments = await Payment.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = payments[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalClubs: {
        total: totalClubs,
        approved: approvedClubs,
        pending: pendingClubs,
        rejected: rejectedClubs
      },
      totalMemberships,
      totalEvents,
      totalRevenue
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Get Manager Stats
// @route   GET /api/dashboard/manager/stats
// @access  Private/ClubManager
export const getManagerStats = async (req, res) => {
  try {
    const myClubs = await Club.find({ managerEmail: req.user.email });
    const clubIds = myClubs.map(c => c._id);

    const totalMembers = await Membership.countDocuments({ clubId: { $in: clubIds }, status: 'active' });
    const totalEvents = await Event.countDocuments({ clubId: { $in: clubIds } });
    
    const payments = await Payment.aggregate([
        { $match: { clubId: { $in: clubIds }, status: 'succeeded' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = payments[0]?.totalRevenue || 0;

    res.json({
        totalClubs: myClubs.length,
        totalMembers,
        totalEvents,
        totalRevenue
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
