import express from 'express';
import Vehicle from '../models/vehicle.js';

const router = express.Router();

// Get vehicles for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.params.userId });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new vehicle
router.post('/', async (req, res) => {
  try {
    const { userId, make, model, year, licensePlate, color } = req.body;
    const vehicle = await Vehicle.create({ userId, make, model, year, licensePlate, color });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
