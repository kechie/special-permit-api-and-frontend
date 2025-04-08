const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Create a new permit
router.post('/', auth, validate.permit, permitController.createPermit);

// Get all permits
router.get('/', auth, permitController.getAllPermits);

// Get a permit by ID
router.get('/:id', auth, permitController.getPermitById);

// Update a permit by ID
router.put('/:id', auth, validate.permit, permitController.updatePermit);

// Delete a permit by ID
router.delete('/:id', auth, permitController.deletePermit);

module.exports = router;