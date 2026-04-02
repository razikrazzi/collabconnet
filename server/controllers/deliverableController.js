const Deliverable = require('../models/Deliverable');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// @desc    Submit a deliverable
// @route   POST /api/deliverables
// @access  Private (Influencer only)
const submitDeliverable = async (req, res) => {
    const { campaignId, title, links, fileUrl, notes } = req.body;

    // First check if a deliverable already exists for this campaign/influencer
    let deliverable = await Deliverable.findOne({ campaign: campaignId, influencer: req.user._id });

    try {
        if (deliverable) {
            // Update existing
            deliverable.title = title;
            deliverable.links = links || [];
            if (links && links.length > 0) {
                deliverable.link = links[0]; // Set singular field for backward compatibility
            }
            deliverable.fileUrl = fileUrl;
            deliverable.notes = notes;
            deliverable.status = 'Pending'; // Set to Pending for workspace consistency
            deliverable.submittedAt = Date.now();
            await deliverable.save();
        } else {
            // Create new
            deliverable = await Deliverable.create({
                campaign: campaignId,
                influencer: req.user._id,
                title,
                links: links || [],
                link: (links && links.length > 0) ? links[0] : '',
                fileUrl,
                notes,
                status: 'Pending'
            });
        }

        // Notify Brand
        const campaign = await Campaign.findById(campaignId);
        if (campaign) {
            await Notification.create({
                user: campaign.brand,
                title: 'New Deliverable Submitted',
                message: `${req.user.name} submitted a deliverable for ${campaign.title}`,
                type: 'deliverable_submitted'
            });
        }

        res.status(deliverable.isNew ? 201 : 200).json(deliverable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Review deliverable (Approve/Request Revision)
// @route   PUT /api/deliverables/:id
// @access  Private (Brand only)
const reviewDeliverable = async (req, res) => {
    const { status } = req.body;

    try {
        const deliverable = await Deliverable.findById(req.params.id).populate('campaign');
        if (deliverable) {
            deliverable.status = status;
            await deliverable.save();

            // If Approved, create a pending payment
            if (status === 'Approved') {
                const existingPayment = await Payment.findOne({
                    campaign: deliverable.campaign._id,
                    influencer: deliverable.influencer,
                    brand: req.user._id
                });

                if (!existingPayment) {
                    await Payment.create({
                        brand: req.user._id,
                        influencer: deliverable.influencer,
                        campaign: deliverable.campaign._id,
                        amount: deliverable.campaign.budget || 0,
                        status: 'Pending'
                    });
                }
            }

            // Notify Influencer
            await Notification.create({
                user: deliverable.influencer,
                title: 'Deliverable Status Updated',
                message: `Your deliverable "${deliverable.title}" is now ${status}`,
                type: 'deliverable_status_updated'
            });

            res.json(deliverable);
        } else {
            res.status(404).json({ message: 'Deliverable not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get deliverables for a brand's campaigns
// @route   GET /api/deliverables/brand
// @access  Private (Brand only)
const getBrandDeliverables = async (req, res) => {
    try {
        console.log(`[DeliverableController] Fetching deliverables for brand: ${req.user._id}`);
        const campaigns = await Campaign.find({ brand: req.user._id });
        const campaignIds = campaigns.map(c => c._id);
        console.log(`[DeliverableController] Found ${campaigns.length} campaigns for brand`);
        
        const deliverables = await Deliverable.find({ campaign: { $in: campaignIds } })
            .populate('campaign', 'title budget status')
            .populate('influencer', 'name email profileImage');
        
        console.log(`[DeliverableController] Returning ${deliverables.length} deliverables`);
        res.json(deliverables);
    } catch (error) {
        console.error('[DeliverableController] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get deliverables for a campaign
// @route   GET /api/deliverables/campaign/:campaignId
// @access  Private
const getDeliverablesByCampaign = async (req, res) => {
    try {
        const deliverables = await Deliverable.find({ campaign: req.params.campaignId })
            .populate('influencer', 'name email profileImage');
        res.json(deliverables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get deliverable by ID
// @route   GET /api/deliverables/:id
// @access  Private
const getDeliverableById = async (req, res) => {
    try {
        const deliverable = await Deliverable.findById(req.params.id)
            .populate('campaign', 'title budget goals description')
            .populate('influencer', 'name email profileImage category bio followers engagementRate');
        
        if (deliverable) {
            res.json(deliverable);
        } else {
            res.status(404).json({ message: 'Deliverable not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    submitDeliverable, 
    reviewDeliverable, 
    getDeliverablesByCampaign, 
    getBrandDeliverables,
    getDeliverableById 
};
