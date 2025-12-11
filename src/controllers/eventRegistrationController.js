import EventRegistration from '../models/EventRegistration.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';

// @desc    Register for event (Free only)
// @route   POST /api/event-registrations/register
// @access  Private
export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    if (event.isPaid && event.eventFee > 0) {
      res.status(400);
      throw new Error('Payment required for this event');
    }

    const existing = await EventRegistration.findOne({
      userEmail: req.user.email,
      eventId,
      status: 'registered',
    });

    if (existing) {
      res.status(400);
      throw new Error('Already registered');
    }

    const registration = await EventRegistration.create({
      userEmail: req.user.email,
      eventId,
      clubId: event.clubId,
      status: 'registered',
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Check if user is registered for event
// @route   GET /api/event-registrations/check/:eventId
// @access  Private
export const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const registration = await EventRegistration.findOne({
      userEmail: req.user.email,
      eventId,
      status: 'registered',
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get my registrations
// @route   GET /api/event-registrations/my
// @access  Private
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userEmail: req.user.email })
      .populate('eventId', 'title eventDate location')
      .populate('clubId', 'clubName')
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get registrations for an event
// @route   GET /api/event-registrations/event/:eventId
// @access  Private/ClubManager
export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const club = await Club.findById(event.clubId);
    if (club.managerEmail !== req.user.email && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    const registrations = await EventRegistration.find({ eventId: req.params.eventId })
      .sort({ registeredAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
