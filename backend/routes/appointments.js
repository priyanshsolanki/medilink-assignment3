const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.post('/book', auth, role('patient'), appointmentsController.bookAppointment);
router.get('/patient/:patientId', auth, role(['patient', 'admin']), appointmentsController.getAppointmentsByPatient);
router.get('/doctor/:doctorId', auth, role(['doctor', 'admin']), appointmentsController.getAppointmentsByDoctor);
router.put('/:appointmentId/reschedule', auth, role(['patient', 'admin']), appointmentsController.rescheduleAppointment);
router.delete('/:appointmentId', auth, role(['patient', 'admin']), appointmentsController.cancelAppointment);
router.patch('/:appointmentId/status', auth, role(['doctor', 'admin']), appointmentsController.updateAppointmentStatus);
router.get('/:id/call-link', auth, role(['patient', 'doctor', 'admin']), appointmentsController.getCallLink);

module.exports = router;