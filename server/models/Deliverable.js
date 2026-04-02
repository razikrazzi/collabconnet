const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    links: { type: [String], default: [] },
    fileUrl: { type: String },
    status: {
        type: String,
        enum: ['Draft Submitted', 'Under Review', 'Revision Requested', 'Approved', 'Pending'],
        default: 'Under Review'
    },
    notes: { type: String },
    dueDate: { type: Date },
    submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Deliverable', deliverableSchema);
