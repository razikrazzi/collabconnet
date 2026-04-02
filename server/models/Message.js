const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messageText: { type: String },
    fileUrl: { type: String },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'document'],
        default: 'text'
    },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Sent', 'Delivered', 'Seen'],
        default: 'Sent'
    },
});

module.exports = mongoose.model('Message', messageSchema);
