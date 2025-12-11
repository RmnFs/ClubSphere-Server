import Club from '../models/Club.js';

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private/ClubManager
export const createClub = async (req, res) => {
  try {
    const {
      clubName,
      description,
      category,
      location,
      bannerImage,
      membershipFee,
    } = req.body;

    const clubExists = await Club.findOne({ clubName });

    if (clubExists) {
      res.status(400);
      throw new Error('Club already exists');
    }

    const club = await Club.create({
      clubName,
      description,
      category,
      location,
      bannerImage,
      membershipFee,
      managerEmail: req.user.email,
      status: 'pending', // Default
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get all clubs (with search & filter)
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = { status: 'approved' }; // Show only approved clubs publicly

    if (search) {
      query.clubName = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 }; // Default Newest
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'fee-asc') {
      sortOption = { membershipFee: 1 };
    } else if (sort === 'fee-desc') {
      sortOption = { membershipFee: -1 };
    }

    const clubs = await Club.find(query).sort(sortOption);
    res.json(clubs);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (club) {
      res.json(club);
    } else {
      res.status(404);
      throw new Error('Club not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Club not found');
  }
};

// @desc    Update club status (Approve/Reject)
// @route   PUT /api/clubs/:id/status
// @access  Private/Admin
export const updateClubStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const club = await Club.findById(req.params.id);

    if (club) {
      club.status = status;
      const updatedClub = await club.save();
      res.json(updatedClub);
    } else {
      res.status(404);
      throw new Error('Club not found');
    }
  } catch (error) {
    res.status(400);
    throw new Error('Invalid data');
  }
};

// @desc    Update club details
// @route   PUT /api/clubs/:id
// @access  Private/ClubManager
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error('Club not found');
    }

    // Check ownership
    if (club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this club');
    }

    // Update allowed fields
    club.clubName = req.body.clubName || club.clubName;
    club.description = req.body.description || club.description;
    club.category = req.body.category || club.category;
    club.location = req.body.location || club.location;
    club.bannerImage = req.body.bannerImage || club.bannerImage;
    club.membershipFee = req.body.membershipFee !== undefined ? req.body.membershipFee : club.membershipFee;

    // If updated by manager, maybe reset status to pending? 
    // Requirement doesn't specify, but it's safe to keep as is for now or let admin decide.
    // For now, we don't reset status on update to avoid annoyance, unless critical.

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get all clubs (Admin/Manager view - includes pending)
// @route   GET /api/clubs/all
// @access  Private/Admin or Manager
export const getAllClubsAdmin = async (req, res) => {
  try {
    let query = {};
    // If manager, only show their clubs (?) Or maybe they want to see all?
    // Requirement says Manager: "View and edit clubs where managerEmail equals the logged-in user"
    if (req.user.role === 'clubManager') {
      query.managerEmail = req.user.email;
    }

    // Admin sees all
    const clubs = await Club.find(query).sort({ createdAt: -1 });
    res.json(clubs);

  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
}


// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      await Club.deleteOne({ _id: req.params.id });
      res.json({ message: 'Club removed' });
    } else {
      res.status(404);
      throw new Error('Club not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};
