//file routes/permits.js
const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const validatePermit = require('../middleware/validatePermit');
const { verifyToken } = require('../middleware/auth');

// Create a new permit
router.post('/', verifyToken, validatePermit, permitController.createPermit);

// Get all permits
router.get('/', verifyToken, permitController.getAllPermits);

// Get a permit by ID
router.get('/:id', verifyToken, permitController.getPermitById);

// Update a permit by ID
router.put('/:id', verifyToken, validatePermit, permitController.updatePermit);

// Delete a permit by ID
router.delete('/:id', verifyToken, permitController.deletePermit);


module.exports = router;