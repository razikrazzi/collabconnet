const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pitch: {
        type: String,
        required: true,
        minlength: 50
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
