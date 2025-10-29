const asyncHandler = require('express-async-handler');

// Lazily create Razorpay instance from env
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured');
  }
  let Razorpay;
  try {
    Razorpay = require('razorpay');
  } catch (e) {
    const err = new Error('Razorpay SDK not installed. Please run: npm install razorpay');
    err.statusCode = 500;
    throw err;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payments/order { amount, currency }
// amount in rupees on frontend; we convert to paise (integer)
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body || {};
  if (!amount || Number.isNaN(Number(amount))) {
    return res.status(400).json({ message: 'amount is required (in INR)' });
  }
  const rzp = getRazorpay();
  const options = {
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
  };
  const order = await rzp.orders.create(options);
  return res.json({
    order,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

module.exports = { createOrder };
