const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // e.g., Appointment._id
    },
    type: {
        type: String,
        enum: ['appointment', 'reschedule', 'cancel', 'status_update'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    deliveryMethod: {
        type: String,
        enum: ['sms', 'email'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending',
    },
    scheduledTime: {
        type: Date,
        required: true,
    },
    sentAt: {
        type: Date,
    },
    attemptCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);