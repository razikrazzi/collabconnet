const express = require('express');
const { 
    submitDeliverable, 
    reviewDeliverable, 
    getDeliverablesByCampaign, 
    getBrandDeliverables,
    getDeliverableById 
} = require('../controllers/deliverableController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, authorize('Influencer'), submitDeliverable);

router.route('/brand')
    .get(protect, authorize('Brand'), getBrandDeliverables);

router.route('/campaign/:campaignId')
    .get(protect, getDeliverablesByCampaign);

router.route('/:id')
    .get(protect, getDeliverableById)
    .put(protect, authorize('Brand'), reviewDeliverable);

module.exports = router;
