const Notification = require('../models/Notification');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class NotificationService {
    static async scheduleNotification(userId, relatedId, type, message, deliveryMethod, scheduledTime) {
        const notification = new Notification({
            userId,
            relatedId,
            type,
            message,
            deliveryMethod,
            scheduledTime,
        });
        await notification.save();
        return notification;
    }

    static async sendNotification(notification) {
        try {
            let result;
            if (notification.deliveryMethod === 'sms') {
                result = await twilioClient.messages.create({
                    body: notification.message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: process.env.TEST_PHONE_NUMBER || '+1234567890',
                });
            } else if (notification.deliveryMethod === 'email') {
                result = await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.TEST_EMAIL || 'user@example.com',
                    subject: 'MediLink Notification',
                    text: notification.message,
                });
            }

            notification.status = 'sent';
            notification.sentAt = new Date();
            notification.attemptCount += 1;
            await notification.save();
            return result;
        } catch (error) {
            notification.status = 'failed';
            notification.attemptCount += 1;
            await notification.save();
            throw new Error(`Failed to send notification: ${error.message}`);
        }
    }

    static async processPendingNotifications() {
        const pending = await Notification.find({ status: 'pending', scheduledTime: { $lte: new Date() } });
        for (const notification of pending) {
            await this.sendNotification(notification);
        }
    }
}

module.exports = NotificationService;