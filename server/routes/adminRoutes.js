const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllCampaigns,
    getAdminStats,
    deleteUser,
    deleteCampaign
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and restricted to Admin only
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/campaigns', getAllCampaigns);
router.delete('/campaigns/:id', deleteCampaign);

module.exports = router;
