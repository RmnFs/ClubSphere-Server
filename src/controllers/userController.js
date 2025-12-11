import User from '../models/User.js';

// @desc    Sync user from Firebase to MongoDB (Create or Update)
// @route   POST /api/users/sync
// @access  Private
export const syncUser = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user info if needed
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      // We don't update role here usually
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        photoURL,
        role: 'member' // Default role
      });
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Update user profile (name, photo)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, photoURL } = req.body;

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = name || user.name;
    user.photoURL = photoURL || user.photoURL;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
