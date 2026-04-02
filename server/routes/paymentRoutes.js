const express = require('express');
const { getPayments, releasePayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getPayments);

router.route('/:id/release')
    .put(protect, authorize('Brand'), releasePayment);

module.exports = router;
