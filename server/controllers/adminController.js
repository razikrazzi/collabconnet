const User = require('../models/User');
const Campaign = require('../models/Campaign');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all campaigns
// @route   GET /api/admin/campaigns
// @access  Private (Admin only)
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({}).populate('brand', 'name companyName email');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBrands = await User.countDocuments({ role: 'Brand' });
        const totalInfluencers = await User.countDocuments({ role: 'Influencer' });
        const totalCampaigns = await Campaign.countDocuments();
        const activeCampaigns = await Campaign.countDocuments({ status: 'Active' });

        // Simple aggregate for total budget
        const campaigns = await Campaign.find({});
        const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

        res.json({
            totalUsers,
            totalBrands,
            totalInfluencers,
            totalCampaigns,
            activeCampaigns,
            totalBudget
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/admin/campaigns/:id
// @access  Private (Admin only)
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            await Campaign.deleteOne({ _id: campaign._id });
            res.json({ message: 'Campaign removed' });
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllCampaigns,
    getAdminStats,
    deleteUser,
    deleteCampaign
};
