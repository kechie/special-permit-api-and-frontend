const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { verifyToken } = require('../middleware/auth');

// Get all audit logs with pagination
router.get('/', verifyToken, auditLogController.getAllAuditLogs);

// Get audit logs for a specific entity (table/record)
router.get('/:tableName/:recordId', verifyToken, auditLogController.getEntityAuditLogs);

// Get audit logs by user
router.get('/users/:userId', verifyToken, auditLogController.getUserAuditLogs);

module.exports = router;