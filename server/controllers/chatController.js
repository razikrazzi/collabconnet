const Message = require('../models/Message');
const CampaignChat = require('../models/CampaignChat');

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
    const { campaignId, receiverId, messageText, fileUrl, messageType } = req.body;

    try {
        const message = await Message.create({
            campaignId,
            senderId: req.user._id,
            receiverId,
            messageText,
            fileUrl,
            messageType: messageType || 'text',
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages for a campaign
// @route   GET /api/messages/:campaignId
// @access  Private
const getCampaignMessages = async (req, res) => {
    try {
        const messages = await Message.find({ campaignId: req.params.campaignId })
            .sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a chat room for a campaign
// @route   POST /api/chat/create
// @access  Private
const createChatRoom = async (req, res) => {
    const { campaignId, brandId, influencerId } = req.body;

    try {
        // Check if chat room already exists
        let chat = await CampaignChat.findOne({ campaignId });

        if (!chat) {
            chat = await CampaignChat.create({
                campaignId,
                brandId,
                influencerId
            });
        }

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chat history between two users (Global Chat)
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user._id }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getCampaignMessages,
    createChatRoom,
    getChatHistory
};
