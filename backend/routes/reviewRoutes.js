import express from 'express';
import Review from '../models/review.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userName, userEmail, rating, comment } = req.body;
    const review = await Review.create({ userName, userEmail, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort('-date');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
