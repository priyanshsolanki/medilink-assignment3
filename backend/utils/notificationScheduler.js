const cron = require('node-cron');
const NotificationService = require('./notificationService');

class NotificationScheduler {
    static start() {
        // Run every minute to check for pending notifications
        cron.schedule('* * * * *', async () => {
            await NotificationService.processPendingNotifications();
        });
    }
}

module.exports = NotificationScheduler;