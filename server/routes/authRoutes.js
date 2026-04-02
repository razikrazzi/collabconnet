const express = require('express');
const { registerUser, authUser, getUserProfile, getInfluencers, updateUserProfile, getBrands, getBrandById } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/brands', protect, getBrands);
router.get('/brands/:id', protect, getBrandById);
router.get('/influencers', protect, getInfluencers);
router.put('/onboarding-update', protect, (req, res, next) => {
    console.log('🚀 /api/auth/onboarding-update HIT');
    next();
}, updateUserProfile);

router.get('/test', (req, res) => res.json({ message: 'Auth routes working', version: 'v3' }));

module.exports = router;
