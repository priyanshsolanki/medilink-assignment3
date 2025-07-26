const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const NotificationService = require('../utils/notificationService');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Send a message
router.post('/send', auth, async (req, res) => {
    try {
        const { recipientId, encryptedContent, iv } = req.body;

        if (!recipientId || !encryptedContent || !iv) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const senderId = req.user.id;
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Allow any authenticated user to message any other user
        if (senderId === recipientId) {
            return res.status(403).json({ message: 'Cannot send message to yourself' });
        }

        const message = new Message({
            senderId,
            recipientId,
            encryptedContent,
            iv,
        });
        await message.save();

        // Notify recipient of new message
        const sender = await User.findById(senderId, 'name');
        await NotificationService.scheduleNotification(
            recipientId,
            message._id,
            'message',
            `New message from ${sender.name}. Please check your inbox.`,
            'email',
            new Date()
        );

        res.status(201).json({ message: 'Message sent successfully', messageId: message._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get messages for the logged-in user from a specific user
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.params.userId;

        if (!targetUserId) {
            return res.status(400).json({ message: 'Target user ID is required' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // Fetch messages where the logged-in user is either sender or recipient
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: targetUserId },
                { senderId: targetUserId, recipientId: userId }
            ]
        }).populate('senderId', 'name').sort({ timestamp: -1 }); // Sort by timestamp descending

        if (!messages.length) {
            return res.status(404).json({ message: 'No conversation found with this user' });
        }

        res.json(messages.map(msg => ({
            id: msg._id,
            senderName: msg.senderId.name,
            encryptedContent: msg.encryptedContent,
            iv: msg.iv,
            isRead: msg.isRead,
            timestamp: msg.timestamp,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all messages for the logged-in user
router.get('/inbox', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            recipientId: userId,
        }).populate('senderId', 'name').sort({ timestamp: -1 }); // Sort by timestamp descending

        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.json(messages.map(msg => ({
            id: msg._id,
            senderName: msg.senderId.name,
            encryptedContent: msg.encryptedContent,
            iv: msg.iv,
            isRead: msg.isRead,
            timestamp: msg.timestamp,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Mark message as read
router.put('/:messageId/read', auth, async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.recipientId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: cannot mark others\' messages as read' });
        }

        message.isRead = true;
        await message.save();

        res.json({ message: 'Message marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;