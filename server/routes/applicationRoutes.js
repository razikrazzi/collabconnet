const express = require('express');
const {
    createApplication,
    getMyApplications,
    getBrandApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Influencer'), createApplication);
router.get('/my', protect, authorize('Influencer'), getMyApplications);
router.get('/brand', protect, authorize('Brand'), getBrandApplications);
router.put('/:id/status', protect, authorize('Brand'), updateApplicationStatus);

module.exports = router;
