const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');

// Create an order (public, for donation/landing usage)
router.post('/order', createOrder);

module.exports = router;
