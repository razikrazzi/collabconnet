const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Released'],
        default: 'Pending'
    },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
