const jwt = require('jsonwebtoken');

// Utility: generate secure call link JWT token
exports.generateCallLinkToken = (appointment, user) => {
    const startTime = new Date(`${appointment.date}T${appointment.time}:00Z`);
    const expireAfter = new Date(startTime.getTime() + 15 * 60000); // 15 min after start
    const expiresIn = Math.floor((expireAfter.getTime() - Date.now()) / 1000);

    if (expiresIn <= 0) return null; // expired already

    const token = jwt.sign(
        {
            appointmentId: appointment._id,
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return `https://medilink.com/consult/${appointment._id}?token=${token}`;
};