const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    timeline: { type: Date, required: true },
    category: { type: String, required: true, enum: ['Fashion', 'Technology', 'Lifestyle', 'Gaming', 'Fitness', 'Beauty', 'Food', 'Travel'] },
    platform: { type: [String], default: ['Instagram'] },
    goals: { type: [String] },
    targetAudience: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    influencersParticipating: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);
