const express = require('express');
const {
    sendMessage,
    getCampaignMessages,
    createChatRoom,
    getChatHistory
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

// Existing routes are consolidated and renamed to match the prompt requirements
router.post('/send', protect, sendMessage);
router.get('/campaign/:campaignId', protect, getCampaignMessages);
router.post('/create', protect, createChatRoom);
router.post('/upload', protect, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path });
});

router.get('/:userId', protect, getChatHistory);

module.exports = router;
