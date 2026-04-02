const Invitation = require('../models/Invitation');
const Campaign = require('../models/Campaign');

// @desc    Send invitation to influencer
// @route   POST /api/invitations
// @access  Private (Brand)
const sendInvitation = async (req, res) => {
    try {
        const { campaignId, influencerId, message, reward } = req.body;

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const invitation = await Invitation.create({
            campaign: campaignId,
            brand: req.user._id,
            influencer: influencerId,
            message,
            reward
        });

        res.status(201).json(invitation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get influencer's invitations
// @route   GET /api/invitations/my
// @access  Private (Influencer)
const getMyInvitations = async (req, res) => {
    try {
        let invitations = await Invitation.find({ influencer: req.user._id })
            .populate('campaign', 'title budget image category')
            .populate('brand', 'companyName name profileImage industry')
            .sort({ createdAt: -1 });

        // Seed some data if empty
        if (invitations.length === 0) {
            console.log('No invitations found for user', req.user._id, '- starting seeding process...');
            const Campaign = require('../models/Campaign');
            const User = require('../models/User');
            
            let brand = await User.findOne({ role: 'Brand' });
            
            // If no brand exists, create a system brand for demo
            if (!brand) {
                console.log('No brands found in DB, creating demo brand...');
                brand = await User.create({
                    name: 'Glow Beauty Support',
                    email: 'glow@example.com',
                    password: 'password123',
                    role: 'Brand',
                    companyName: 'Glow Beauty',
                    industry: 'Cosmetics'
                });
            }

            let campaign = await Campaign.findOne({ brand: brand._id });
            
            // If no campaign exists, create a demo campaign
            if (!campaign) {
                console.log('No campaigns found for brand', brand.companyName, '- creating demo campaign...');
                campaign = await Campaign.create({
                    title: 'Summer Glow 2024',
                    description: 'Global lifestyle collection launch',
                    brand: brand._id,
                    budget: 5000,
                    category: 'Beauty',
                    timeline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    status: 'Active'
                });
            }

            if (brand && campaign) {
                console.log('Creating mock invitations for influencer...');
                const mockInvites = [
                    {
                        campaign: campaign._id,
                        brand: brand._id,
                        influencer: req.user._id,
                        message: "We love your recent minimalist aesthetic! We think you'd be a perfect fit for our new collection launch.",
                        reward: "$1,500",
                        status: 'New'
                    },
                    {
                        campaign: campaign._id,
                        brand: brand._id,
                        influencer: req.user._id,
                        message: "Your creative content is top-notch. We'd love to collaborate on our upcoming series.",
                        reward: "$2,200",
                        status: 'New'
                    }
                ];
                await Invitation.insertMany(mockInvites);
                invitations = await Invitation.find({ influencer: req.user._id })
                    .populate('campaign', 'title budget image category')
                    .populate('brand', 'companyName name profileImage industry')
                    .sort({ createdAt: -1 });
                console.log('Seeding complete. Total invites:', invitations.length);
            }
        }

        res.json(invitations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update invitation status
// @route   PUT /api/invitations/:id/status
// @access  Private (Influencer)
const updateInvitationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const invitation = await Invitation.findById(req.params.id);

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        if (invitation.influencer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        invitation.status = status;

        if (status === 'Accepted') {
            const campaign = await Campaign.findById(invitation.campaign);
            if (!campaign.influencersParticipating.includes(req.user._id)) {
                campaign.influencersParticipating.push(req.user._id);
                await campaign.save();
            }
        }

        await invitation.save();
        res.json(invitation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendInvitation,
    getMyInvitations,
    updateInvitationStatus
};
