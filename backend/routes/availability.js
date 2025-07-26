const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.get('/', auth, availabilityController);
router.get('/:id', auth, availabilityController);
router.post('/', auth, role('doctor'), availabilityController);
router.put('/:id', auth, role('doctor'), availabilityController);
router.delete('/:id', auth, role('doctor'), availabilityController);

module.exports = router;