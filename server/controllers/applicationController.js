const Application = require('../models/Application');
const Campaign = require('../models/Campaign');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Influencer)
const createApplication = async (req, res) => {
    try {
        const { campaignId, pitch } = req.body;

        // Check if campaign exists
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            campaign: campaignId,
            influencer: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this campaign' });
        }

        const application = await Application.create({
            campaign: campaignId,
            influencer: req.user._id,
            pitch
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get influencer applications
// @route   GET /api/applications/my
// @access  Private (Influencer)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ influencer: req.user._id })
            .populate('campaign', 'title budget timeline image category')
            .populate({
                path: 'campaign',
                populate: {
                    path: 'brand',
                    select: 'companyName name profileImage'
                }
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a brand's campaigns
// @route   GET /api/applications/brand
// @access  Private (Brand)
const getBrandApplications = async (req, res) => {
    try {
        // Find all campaigns of this brand
        const campaigns = await Campaign.find({ brand: req.user._id });
        const campaignIds = campaigns.map(c => c._id);

        const applications = await Application.find({ campaign: { $in: campaignIds } })
            .populate('campaign', 'title')
            .populate('influencer', 'name email category niche followers engagementRate profileImage')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Brand)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('campaign');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if brand owns the campaign
        if (application.campaign.brand.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        
        // If approved, add influencer to campaign's participating list
        if (status === 'Approved') {
            const campaign = await Campaign.findById(application.campaign._id);
            if (!campaign.influencersParticipating.includes(application.influencer)) {
                campaign.influencersParticipating.push(application.influencer);
                await campaign.save();
            }
        }

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getBrandApplications,
    updateApplicationStatus
};
