const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Brand only)
const createCampaign = async (req, res) => {
    try {
        console.log('--- CAMPAIGN CREATION ATTEMPT ---');
        console.log('User ID from Token:', req.user?._id);
        console.log('Payload Keys:', Object.keys(req.body));
        console.log('Campaign Title:', req.body.title);

        const { title, description, budget, timeline, category, platform, goals, targetAudience, image } = req.body;

        const campaign = await Campaign.create({
            brand: req.user._id,
            title,
            description,
            budget,
            timeline,
            category,
            platform,
            goals,
            targetAudience,
            image
        });

        console.log('✅ Campaign Created Successfully:', campaign._id);
        res.status(201).json(campaign);
    } catch (error) {
        console.error('❌ Campaign Creation Error Details:', error);
        res.status(500).json({
            message: error.message,
            errors: error.errors
        });
    }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = async (req, res) => {
    try {
        let campaigns;
        if (req.user.role === 'Brand') {
            campaigns = await Campaign.find({ brand: req.user._id }).populate('brand', 'name companyName');
        } else if (req.user.role === 'Influencer') {
            // For influencers, show only Active campaigns or campaigns they are part of
            campaigns = await Campaign.find({
                $or: [
                    { status: 'Active' },
                    { influencersParticipating: req.user._id }
                ]
            }).populate('brand', 'name companyName');
        } else if (req.user.role === 'Admin') {
            // For admins, show all campaigns
            campaigns = await Campaign.find({}).populate('brand', 'name companyName');
        } else {
            campaigns = await Campaign.find({
                status: 'Active'
            }).populate('brand', 'name companyName');
        }
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get campaign by ID
// @route   GET /api/campaigns/:id
// @access  Private
const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('brand', 'name companyName');
        if (campaign) {
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update campaign status
// @route   PUT /api/campaigns/:id/status
// @access  Private (Brand only)
const updateCampaignStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        console.log(`[Campaign Status Update] ID: ${id}, New Status: ${status}`);

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('brand', 'name companyName');

        if (updatedCampaign) {
            console.log(`✅ Campaign ${id} updated to ${status}`);
            res.json(updatedCampaign);
        } else {
            console.log(`❌ Campaign ${id} not found`);
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        console.error('❌ Status Update Error:', error);
        res.status(500).json({
            message: 'Failed to update campaign status',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Smart Matching Algorithm
// @route   GET /api/campaigns/:id/match
// @access  Private (Brand only)
const matchInfluencers = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // 1. Filter influencers by category
        const influencers = await User.find({ role: 'Influencer', category: campaign.category });

        // 2. Calculate match score
        // matchScore = (engagementRate * 0.6) + (categoryMatch * 0.4)
        // Since we already filtered by category, categoryMatch is 1 (100%)
        const recommendations = influencers.map(inf => {
            const matchScore = (inf.engagementRate * 0.6) + (1 * 0.4 * 10); // Normalizing category match
            return {
                ...inf._doc,
                matchScore: matchScore.toFixed(2)
            };
        });

        // 3. Sort by match score
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        res.json(recommendations.slice(0, 5)); // Return top 5
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCampaign, getCampaigns, getCampaignById, updateCampaignStatus, matchInfluencers };
