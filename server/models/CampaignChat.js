const mongoose = require('mongoose');

const campaignChatSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

// Ensure only one chat room per campaign
campaignChatSchema.index({ campaignId: 1 }, { unique: true });

module.exports = mongoose.model('CampaignChat', campaignChatSchema);
