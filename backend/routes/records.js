// routes/records.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const role    = require('../middlewares/role');
const upload  = require('../middlewares/upload');      // your multer/cloudinary middleware
const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  downloadRecordFile
} = require('../controllers/recordsController');

// ─── List & Create ───────────────────────────────────────────
// GET  /api/patients/:patientId/records   → getRecords
// POST /api/patients/:patientId/records   → createRecord
router
  .route('/patients/:patientId/records')
  .get(
    auth,
    role('patient','doctor','admin'),
    getRecords
  )
  .post(
    auth,
    role('doctor','admin'),
    upload.single('file'),   // expects <input name="file"/>
    createRecord
  );
// download a file
  router.get(
    '/records/:recordId/download',
    auth,
    role('doctor', 'admin', 'patient'),
    downloadRecordFile
  );

// ─── Read, Update & Delete ───────────────────────────────────
// GET    /api/records/:recordId → getRecord
// PUT    /api/records/:recordId → updateRecord
// DELETE /api/records/:recordId → deleteRecord
router
  .route('/records/:recordId')
  .get(
    auth,
    role('patient','doctor','admin'),
    getRecord
  )
  .put(
    auth,
    role('doctor','admin'),
    upload.single('file'),   // only if you allow file replacement on update
    updateRecord
  )
  .delete(
    auth,
    role('doctor','admin'),
    deleteRecord
  );

module.exports = router;
