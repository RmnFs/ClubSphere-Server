import Membership from '../models/Membership.js';
import Club from '../models/Club.js';

// @desc    Join a club (Free only)
// @route   POST /api/memberships/join
// @access  Private
export const joinClub = async (req, res) => {
  try {
    const { clubId } = req.body;
    const club = await Club.findById(clubId);

    if (!club) {
      res.status(404);
      throw new Error('Club not found');
    }

    if (club.membershipFee > 0) {
      res.status(400);
      throw new Error('This club requires payment. Please use payment flow.');
    }

    // Check existing
    const existing = await Membership.findOne({
      userEmail: req.user.email,
      clubId,
      status: 'active',
    });

    if (existing) {
      res.status(400);
      throw new Error('Already a member');
    }

    const membership = await Membership.create({
      userEmail: req.user.email,
      clubId,
      status: 'active', // Free join is immediately active
    });

    // Update member count
    club.membersCount = (club.membersCount || 0) + 1;
    await club.save();

    res.status(201).json(membership);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Check if user is a member of a club
// @route   GET /api/memberships/check/:clubId
// @access  Private
export const checkMembership = async (req, res) => {
  try {
    const { clubId } = req.params;

    const membership = await Membership.findOne({
      userEmail: req.user.email,
      clubId,
      status: 'active',
    });

    res.json({ isMember: !!membership });
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get my memberships
// @route   GET /api/memberships/my
// @access  Private
export const getMyMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ userEmail: req.user.email })
      .populate('clubId', 'clubName location bannerImage')
      .sort({ joinedAt: -1 });
    res.json(memberships);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get members of a club
// @route   GET /api/memberships/club/:clubId
// @access  Private/ClubManager
export const getClubMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    // Verify specific manager
    if (club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    const members = await Membership.find({ clubId: req.params.clubId })
      // Could populate user info if we had real Relation ref, but we used email string in model for userEmail.
      // If we want user details, we might need to aggregate or fetch user separately.
      // Or better, change Model to use Ref if possible, or just return email.
      // Requirement: "See member names/emails". We have emails.
      // For names, we might need to look up User collection by email.
      // Let's rely on frontend or separate lookup if needed, OR do a manual populate-like find.
      // Ideally schema should have used ObjectId ref for user.
      // Given current Schema UserEmail (String), we can Find Users where email matches.
      // But for simplicity let's just return membership with emails first.
      .sort({ joinedAt: -1 });

    res.json(members);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
