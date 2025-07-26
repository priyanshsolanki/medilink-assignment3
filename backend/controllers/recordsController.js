// controllers/recordsController.js
const Record = require('../models/Record');
// List all records for a patient
exports.getRecords = async (req, res, next) => {
  const { patientId } = req.params;
  const records = await Record.find({ patientId, isDeleted: false }).populate('uploadedBy lastUpdatedBy', 'name');;
  res.status(200).json(records);
};
// Get one record
exports.getRecord = async (req, res, next) => {
  const { recordId } = req.params;
  const record = await Record.findById(recordId);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.status(200).json(record);
};

exports.createRecord = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { title, type, notes } = req.body;
    let fileUrl = null;
    if (req.file && req.file.path) {
      fileUrl = req.file.path;
    }

    
    const newRec = await Record.create({
      patientId,
      title,
      type,
      notes,
      fileUrl,
      uploadedBy: req.user.id     
    });

    res.status(201).json(newRec);
  } catch (err) {
    next(err);
  }
};


// Update a record
exports.updateRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const updates = {
      ...req.body,
      lastUpdatedBy: req.user._id
    };

    const updated = await Record.findByIdAndUpdate(
      recordId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
// Delete a record
exports.deleteRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const deleted = await Record.findByIdAndUpdate(
      recordId,
      {
        isDeleted: true,
        deletedBy: req.user._id,
        deletedAt: Date.now()
      },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.status(200).json({ message: 'Record soft-deleted', record: deleted });
  } catch (err) {
    next(err);
  }
};
// controllers/recordsController.js

exports.downloadRecordFile = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await Record.findById(recordId);

    if (!record || record.isDeleted) {
      return res.status(404).json({ error: 'Record not found or deleted' });
    }

    // Return the direct URL
    res.json({ fileUrl: record.fileUrl });
  } catch (err) {
    next(err);
  }
};
