const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET all cart items
router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST add item to cart
router.post('/', async (req, res) => {
  try {
    const existing = await Cart.findOne({ movieId: req.body.movieId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }
    const item = new Cart(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
});

// PUT update quantity
router.put('/:id', async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update cart item' });
  }
});

// DELETE remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// DELETE clear entire cart
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;