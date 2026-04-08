const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET all movies, or filter by mood if ?mood= is provided
router.get('/', async (req, res) => {
  try {
    const filter = req.query.mood ? { mood: req.query.mood } : {};
    const movies = await Movie.find(filter);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET single movie by id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// POST create new movie (admin)
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create movie' });
  }
});

// PUT update movie (admin)
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update movie' });
  }
});

// DELETE movie (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

module.exports = router;