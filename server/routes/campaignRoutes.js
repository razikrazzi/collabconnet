const express = require('express');
const {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaignStatus,
    matchInfluencers
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, authorize('Brand'), createCampaign)
    .get(protect, getCampaigns);

router.route('/:id')
    .get(protect, getCampaignById);

router.route('/:id/status')
    .put(protect, authorize('Brand', 'Admin'), updateCampaignStatus);

router.route('/:id/match')
    .get(protect, authorize('Brand'), matchInfluencers);

module.exports = router;
