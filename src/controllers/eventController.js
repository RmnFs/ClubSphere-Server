import Event from '../models/Event.js';
import Club from '../models/Club.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/ClubManager
export const createEvent = async (req, res) => {
  try {
    const {
      clubId,
      title,
      description,
      eventDate,
      location,
      isPaid,
      eventFee,
      maxAttendees,
      bannerImage,
    } = req.body;

    // Verify club ownership
    const club = await Club.findById(clubId);
    if (!club) {
      res.status(404);
      throw new Error('Club not found');
    }

    if (club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to create event for this club');
    }

    const event = await Event.create({
      clubId,
      title,
      description,
      eventDate,
      location,
      isPaid,
      eventFee,
      maxAttendees,
      bannerImage,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get all events (Public - optional filters)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { search, clubId, sort } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (clubId) {
      query.clubId = clubId;
    }

    let sortOption = { eventDate: 1 }; // Default Soonest
    if (sort === 'newest') sortOption = { createdAt: -1 }; // Created recently
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'fee-asc') sortOption = { eventFee: 1 };
    if (sort === 'fee-desc') sortOption = { eventFee: -1 };

    const events = await Event.find(query).sort(sortOption);
    res.json(events);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'clubName');
    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Event not found');
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/ClubManager
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Verify ownership via Club
    const club = await Club.findById(event.clubId);
    if (club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this event');
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.eventDate = req.body.eventDate || event.eventDate;
    event.location = req.body.location || event.location;
    event.isPaid = req.body.isPaid !== undefined ? req.body.isPaid : event.isPaid;
    event.eventFee = req.body.eventFee !== undefined ? req.body.eventFee : event.eventFee;
    event.maxAttendees = req.body.maxAttendees || event.maxAttendees;
    event.bannerImage = req.body.bannerImage || event.bannerImage;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/ClubManager
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    const club = await Club.findById(event.clubId);
    // Allow deletion if club is missing OR user is admin OR user is the club manager
    if (club && club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this event');
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
