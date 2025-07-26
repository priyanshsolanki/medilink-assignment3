const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // ISO date string (e.g., "2025-07-05")
    time: { type: String, required: true }, // HH:mm format (e.g., "15:00")
    status: {
        type: String,
        enum: ['confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);