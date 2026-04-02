const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get payment history/milestones
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        console.log(`[PaymentController] Fetching payments - Role: ${req.user.role}, ID: ${req.user._id}`);
        let payments;
        if (req.user.role === 'Brand') {
            payments = await Payment.find({ brand: req.user._id })
                .populate('influencer', 'name email')
                .populate('campaign', 'title');
        } else {
            payments = await Payment.find({ influencer: req.user._id })
                .populate('brand', 'name companyName')
                .populate('campaign', 'title');
        }
        console.log(`[PaymentController] Returning ${payments.length} payments`);
        res.json(payments);
    } catch (error) {
        console.error('[PaymentController] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Release payment
// @route   PUT /api/payments/:id/release
// @access  Private (Brand only)
const releasePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (payment && req.user._id.toString() === payment.brand.toString()) {
            payment.status = 'Released';
            await payment.save();
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPayments, releasePayment };
