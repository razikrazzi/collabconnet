const express = require('express');
const {
    sendInvitation,
    getMyInvitations,
    updateInvitationStatus
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Brand'), sendInvitation);
router.get('/my', protect, authorize('Influencer'), getMyInvitations);
router.put('/:id/status', protect, authorize('Influencer'), updateInvitationStatus);

module.exports = router;
