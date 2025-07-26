const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const NotificationService = require('../utils/notificationService');
const User = require('../models/User');
const { generateCallLinkToken } = require('../utils/generateCallLink');

function getTimeSlots(startTime, endTime) {
    const slots = [];
    let currentTime = new Date(`1970-01-01 ${startTime}`);
    const end = new Date(`1970-01-01 ${endTime}`);

    while (currentTime < end) {
        slots.push(currentTime.toTimeString().slice(0, 5));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
}

exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time } = req.body;

        if (!patientId || !doctorId || !date || !time)
            return res.status(400).json({ message: 'Missing required fields' });

        if (req.user.role !== 'patient')
            return res.status(403).json({ message: 'Only patients can book appointments' });

        if (req.user.id !== patientId) {
            console.log('Logged in userId:', req.user.id, 'Requested patientId:', patientId);
            return res.status(403).json({ message: 'Cannot book appointment for other patients' });
        }

        if (isNaN(Date.parse(date))) return res.status(400).json({ message: 'Invalid date' });
        if (!/^\d{2}:\d{2}$/.test(time)) return res.status(400).json({ message: 'Invalid time format' });

        const availability = await Availability.findOne({ doctorId, date });
        if (!availability) {
            return res.status(200).json({ message: 'No availability for this doctor on the selected date' });
        }

        const { startTime, endTime } = availability;
        const availableSlots = getTimeSlots(startTime, endTime);

        if (!availableSlots.includes(time)) {
            return res.status(200).json({ message: 'Selected time is not within available slots' });
        }

        const conflict = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
        if (conflict) {
            return res.status(200).json({ message: 'Time slot already booked by another patient' });
        }

        const appointment = new Appointment({ patientId, doctorId, date, time, status: 'confirmed' });
        await appointment.save();

        // Fetch user names directly from the database
        const patient = await User.findById(patientId, 'name');
        const doctor = await User.findById(doctorId, 'name');
        if (!patient || !doctor) {
            return res.status(404).json({ message: 'Patient or doctor not found' });
        }
        const patientName = patient.name;
        const doctorName = doctor.name;

        const appointmentDateTime = new Date(`${date}T${time}:00`);
        const reminderTime = new Date(appointmentDateTime - 24 * 60 * 60 * 1000); // 24 hours before
        await NotificationService.scheduleNotification(
            patientId,
            appointment._id,
            'appointment',
            `Reminder: Your appointment with Dr. ${doctorName} is scheduled for ${date} at ${time}.`,
            'email',
            reminderTime
        );
        await NotificationService.scheduleNotification(
            doctorId,
            appointment._id,
            'appointment',
            `Reminder: You have an appointment with ${patientName} on ${date} at ${time}.`,
            'email',
            reminderTime
        );

        const callLink = generateCallLinkToken(appointment, req.user);

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointmentId: appointment._id,
            callLink
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        // if (req.user.role === 'patient' && req.user.id !== patientId)
        //     return res.status(403).json({ message: 'Forbidden: access denied' });

        // 1. Fetch raw appointments
        const appointments = await Appointment.find({ patientId }).lean();
        if (!appointments.length) {
        return res.status(404).json({ message: 'No appointments found' });
        }

        // 2. Gather all doctorIds and patientIds
        const userIds = [
        ...new Set(
            appointments.flatMap(apt => [apt.doctorId.toString(), apt.patientId.toString()])
        )
        ];

        // 3. Bulk fetch name & specialty for doctors, name for patients
        const users = await User.find({ _id: { $in: userIds } })
        .select('name role specialty')
        .lean();

        // 4. Build lookup maps
        const nameMap = {};
        const specialtyMap = {};
        users.forEach(u => {
        nameMap[u._id.toString()] = u.name;
        if (u.role === 'doctor') {
            specialtyMap[u._id.toString()] = u.specialty;
        }
        });

        // 5. Compose final result
        const result = appointments.map(apt => ({
        appointmentId: apt._id,
        doctorId:     apt.doctorId,
        doctorName:   nameMap[apt.doctorId.toString()] || null,
        doctorSpecialty: specialtyMap[apt.doctorId.toString()] || null,
        patientId:    apt.patientId,
        patientName:  nameMap[apt.patientId.toString()] || null,
        date:         apt.date,
        time:         apt.time,
        status:       apt.status,
        callLink:     generateCallLinkToken(apt, req.user),
        type:'Video Consultation' // todo add this field
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (req.user.role === 'doctor' && req.user.id !== doctorId)
            return res.status(403).json({ message: 'Forbidden: access to other doctors not allowed' });

        const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name email').sort({ date: 1, time: 1 });
        if (!appointments.length) return res.status(404).json({ message: 'No appointments found' });

        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { newDate, newTime } = req.body;

        if (!newDate || !newTime)
            return res.status(400).json({ message: 'Missing newDate or newTime' });

        if (isNaN(Date.parse(newDate))) return res.status(400).json({ message: 'Invalid date' });
        if (!/^\d{2}:\d{2}$/.test(newTime)) return res.status(400).json({ message: 'Invalid time format' });

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (req.user.role === 'patient' && req.user.id !== appointment.patientId.toString()) {
            return res.status(403).json({ message: 'Forbidden: cannot reschedule others\' appointments' });
        }

        const availability = await Availability.findOne({ doctorId: appointment.doctorId, date: newDate });
        if (!availability) {
            return res.status(409).json({ message: 'No availability for this doctor on the new date' });
        }

        const { startTime, endTime } = availability;
        const availableSlots = getTimeSlots(startTime, endTime);

        if (!availableSlots.includes(newTime)) {
            return res.status(409).json({ message: 'New time is not within available slots' });
        }

        const conflict = await Appointment.findOne({
            doctorId: appointment.doctorId,
            date: newDate,
            time: newTime,
            status: { $ne: 'cancelled' },
            _id: { $ne: appointmentId }
        });
        if (conflict) return res.status(409).json({ message: 'New time slot unavailable' });

        appointment.date = newDate;
        appointment.time = newTime;
        await appointment.save();

        const patient = await User.findById(appointment.patientId, 'name');
        const doctor = await User.findById(appointment.doctorId, 'name');
        if (!patient || !doctor) {
            return res.status(404).json({ message: 'Patient or doctor not found' });
        }
        const patientName = patient.name;
        const doctorName = doctor.name;

        const newAppointmentDateTime = new Date(`${newDate}T${newTime}:00`);
        const reminderTime = new Date(newAppointmentDateTime - 24 * 60 * 60 * 1000);
        await NotificationService.scheduleNotification(
            appointment.patientId,
            appointment._id,
            'reschedule',
            `Update: Your appointment with Dr. ${doctorName} is now rescheduled to ${newDate} at ${newTime}.`,
            'email',
            reminderTime
        );
        await NotificationService.scheduleNotification(
            appointment.doctorId,
            appointment._id,
            'reschedule',
            `Update: Your appointment with ${patientName} is rescheduled to ${newDate} at ${newTime}.`,
            'email',
            reminderTime
        );

        const callLink = generateCallLinkToken(appointment, req.user);

        res.json({ message: 'Appointment rescheduled', callLink });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        console.log(req.body);
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        console.log(appointment);

        if (req.user.role === 'patient' && req.user.id !== appointment.patientId.toString()) {
            return res.status(403).json({ message: 'Forbidden: cannot cancel others\' appointments' });
        }

        const patient = await User.findById(appointment.patientId, 'name');
        const doctor = await User.findById(appointment.doctorId, 'name');
        if (!patient || !doctor) {
            return res.status(404).json({ message: 'Patient or doctor not found' });
        }
        const patientName = patient.name;
        const doctorName = doctor.name;

        await NotificationService.scheduleNotification(
            appointment.patientId,
            appointment._id,
            'cancel',
            `Notice: Your appointment with Dr. ${doctorName} on ${appointment.date} at ${appointment.time} has been cancelled.`,
            'email',
            new Date()
        );
        await NotificationService.scheduleNotification(
            appointment.doctorId,
            appointment._id,
            'cancel',
            `Notice: Your appointment with ${patientName} on ${appointment.date} at ${appointment.time} has been cancelled.`,
            'email',
            new Date()
        );

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'completed', 'cancelled'].includes(status))
            return res.status(400).json({ message: 'Invalid status' });

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (!['doctor', 'admin'].includes(req.user.role))
            return res.status(403).json({ message: 'Forbidden: insufficient rights' });

        const oldStatus = appointment.status;
        appointment.status = status;
        await appointment.save();

        const patient = await User.findById(appointment.patientId, 'name');
        const doctor = await User.findById(appointment.doctorId, 'name');
        if (!patient || !doctor) {
            return res.status(404).json({ message: 'Patient or doctor not found' });
        }
        const patientName = patient.name;
        const doctorName = doctor.name;

        await NotificationService.scheduleNotification(
            appointment.patientId,
            appointment._id,
            'status_update',
            `Update: Your appointment with Dr. ${doctorName} on ${appointment.date} at ${appointment.time} is now ${status}.`,
            'email',
            new Date()
        );
        await NotificationService.scheduleNotification(
            appointment.doctorId,
            appointment._id,
            'status_update',
            `Update: Your appointment with ${patientName} on ${appointment.date} at ${appointment.time} is now ${status}.`,
            'email',
            new Date()
        );

        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getCallLink = async (req, res) => {
    try {
        const { id: appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const userIdStr = req.user.id;

        const isPatient = appointment.patientId.toString() === userIdStr;
        const isDoctor = appointment.doctorId.toString() === userIdStr;
        if (!(isPatient || isDoctor || req.user.role === 'admin'))
            return res.status(403).json({ message: 'Forbidden: unauthorized user' });

        const callLink = generateCallLinkToken(appointment, req.user);
        if (!callLink) return res.status(410).json({ message: 'Call link expired' });

        res.json({ callLink });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};