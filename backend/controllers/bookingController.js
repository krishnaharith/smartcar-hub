import Booking from "../models/booking.js";
import User from "../models/user.js";
import Service from "../models/service.js";
import { sendBookingConfirmationEmail, sendStatusUpdateEmail } from "../utils/emailService.js";

export const trackBooking = async (req, res) => {
  try {
    const { phone, vehicle } = req.query;
    if (!phone || !vehicle) {
      return res.status(400).json({ error: "Phone and vehicle are required." });
    }

    const users = await User.find({ phone });
    if (users.length === 0) {
       const bookings = await Booking.find({ 
         userEmail: `${phone}@guest.com`,
         vehicle: { $regex: new RegExp(vehicle, 'i') } 
       }).sort({ date: -1 }).lean();
       
       if (bookings.length > 0) return res.json([bookings[0]]);
       return res.status(404).json({ error: "No active bookings found for this info." });
    }

    const userIds = users.map(u => u._id);
    const bookings = await Booking.find({
      userId: { $in: userIds },
      vehicle: { $regex: new RegExp(vehicle, 'i') }
    }).sort({ date: -1 }).lean();

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No active bookings found for this info." });
    }

    const serviceMap = (await Service.find().lean()).reduce((acc, s) => ({...acc, [s._id]: s.name}), {});
    const enriched = bookings.map(b => ({...b, serviceName: serviceMap[b.serviceId] || 'Custom Service'}));

    res.json(enriched);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const bookService = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Send booking confirmation email (fire-and-forget)
    if (req.body.userId) {
      try {
        const user = await User.findById(req.body.userId);
        const service = req.body.serviceId
          ? await Service.findById(req.body.serviceId)
          : null;

        if (user && user.email) {
          sendBookingConfirmationEmail({
            to: user.email,
            customerName: user.name,
            vehicle: req.body.vehicle || 'Your vehicle',
            serviceName: service ? service.name : (req.body.serviceName || 'Service Package'),
            date: req.body.date || new Date(),
          }).catch(err => console.error('[Email] Booking confirmation error:', err));
        }
      } catch (err) {
        console.error('[Email] Could not fetch user for booking email:', err.message);
      }
    }

    res.json({ message: "Service booked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();
    
    const users = await User.find().lean();
    const services = await Service.find().lean();
    
    const userMap = users.reduce((acc, user) => ({ ...acc, [user._id.toString()]: user }), {});
    const serviceMap = services.reduce((acc, srv) => ({ ...acc, [srv._id.toString()]: srv }), {});

    const enrichedBookings = bookings.map(b => ({
      ...b,
      userName: userMap[b.userId] ? userMap[b.userId].name : 'Unknown User',
      userEmail: userMap[b.userId] ? userMap[b.userId].email : 'N/A',
      serviceName: serviceMap[b.serviceId] ? serviceMap[b.serviceId].name : 'Unknown Service',
    }));

    res.json(enrichedBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).lean();
    
    const services = await Service.find().lean();
    const serviceMap = services.reduce((acc, srv) => ({ ...acc, [srv._id.toString()]: srv }), {});

    const enrichedBookings = bookings.map(b => ({
      ...b,
      serviceName: serviceMap[b.serviceId] ? serviceMap[b.serviceId].name : 'Unknown Service',
    }));

    res.json(enrichedBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingStatus } = req.body;
    
    let booking;
    try {
      booking = await Booking.findByIdAndUpdate(
        id,
        { trackingStatus },
        { new: true }
      );
    } catch (castErr) {
       return res.status(400).json({ message: "Invalid booking ID format" });
    }
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Send status update email to customer (fire-and-forget)
    try {
      const user = booking.userId ? await User.findById(booking.userId) : null;
      const service = booking.serviceId ? await Service.findById(booking.serviceId) : null;

      if (user && user.email) {
        sendStatusUpdateEmail({
          to: user.email,
          customerName: user.name,
          vehicle: booking.vehicle || 'Your vehicle',
          serviceName: service ? service.name : 'Service Package',
          newStatus: trackingStatus,
        }).catch(err => console.error('[Email] Status update email error:', err));
      }
    } catch (err) {
      console.error('[Email] Could not send status update email:', err.message);
    }
    
    res.json({ message: "Booking tracking status updated successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};