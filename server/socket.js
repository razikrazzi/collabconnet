const Message = require('./models/Message');

const socketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join for private notifications (Navbar)
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room`);
        });

        // Join a specific campaign room
        socket.on('join_campaign_room', (campaignId) => {
            const roomName = `campaign_${campaignId}`;
            socket.join(roomName);
            console.log(`User joined room: ${roomName}`);
        });

        // Send message event
        socket.on('send_message', async (data) => {
            const { campaignId, senderId, receiverId, messageText, fileUrl, messageType } = data;
            const roomName = `campaign_${campaignId}`;

            try {
                // Persist message to database
                const message = await Message.create({
                    campaignId,
                    senderId,
                    receiverId,
                    messageText,
                    fileUrl,
                    messageType: messageType || 'text',
                    status: 'Sent'
                });

                // Emit to all users in the campaign room
                io.to(roomName).emit('receive_message', message);

                // Also emit a notification event to the receiver specifically
                io.to(receiverId).emit('new_notification', {
                    type: 'message',
                    from: senderId,
                    campaignId,
                    text: `New message: ${messageText?.substring(0, 20)}...`
                });

            } catch (err) {
                console.error('Socket message error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

module.exports = socketEvents;

