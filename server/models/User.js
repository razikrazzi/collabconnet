const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Brand', 'Influencer', 'Admin'], required: true },

    // Influencer Specific
    category: { type: String }, // e.g., Tech, Fashion, Lifestyle
    niche: { type: String },
    engagementRate: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    bio: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    tiktok: { type: String },
    facebook: { type: String },
    website: { type: String },

    // Brand Specific
    companyName: { type: String },
    industry: { type: String },
    description: { type: String },

    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
