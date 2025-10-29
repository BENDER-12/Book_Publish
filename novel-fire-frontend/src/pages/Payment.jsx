import { useState } from 'react';
import { paymentsAPI } from '../api/payments';

function loadRazorpay(src = 'https://checkout.razorpay.com/v1/checkout.js') {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}

const Payment = () => {
  const [amount, setAmount] = useState('199');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startPayment = async () => {
    setError('');
    setLoading(true);
    try {
      await loadRazorpay();
      const { order, keyId } = await paymentsAPI.createOrder({ amount: Number(amount) });
      const options = {
        key: keyId,
        amount: order.amount, // paise
        currency: order.currency,
        name: 'Novashelf',
        description: 'Sample payment',
        order_id: order.id,
        handler: function (response) {
          // TODO: verify payment on backend (recommended)
          alert('Payment successful: ' + response.razorpay_payment_id);
        },
        theme: { color: '#4f46e5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e.message || 'Payment failed to start');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Razorpay Payment</h1>
          <p className="text-gray-600 mt-1">Test checkout for all roles.</p>

          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div>
              <button onClick={startPayment} disabled={loading} className="btn btn-primary">
                {loading ? 'Starting...' : 'Pay with Razorpay'}
              </button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Note: This uses a server-created order. Ensure your backend .env has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET configured.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
