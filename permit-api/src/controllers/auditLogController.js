const { AuditLog, User } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function to get userId from token
const getUserIdFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Helper function to create an audit log
const createAuditLog = async ({ action, tableName, recordId, changes, req }) => {
  try {
    const userId = getUserIdFromToken(req);
    await AuditLog.create({
      action,
      table_name: tableName,
      record_id: recordId,
      changes,
      performed_by_id: userId || 'system'
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// Get all audit logs with pagination
exports.getAllAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const logs = await AuditLog.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: User,
        as: 'performer',
        attributes: ['id', 'username', 'email']
      }]
    });

    // Log this view action
    await createAuditLog({
      action: 'VIEW_ALL_LOGS',
      tableName: 'audit_logs',
      recordId: '09ed8ed0-141f-4ed9-b494-65c1d940b67a', //dummy id
      changes: { query: { page, limit } },
      req
    });

    res.status(200).json({
      logs: logs.rows,
      totalLogs: logs.count,
      totalPages: Math.ceil(logs.count / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    res.status(500).json({ message: 'Error retrieving audit logs', error: error.message });
  }
};

// Get audit logs for a specific entity
exports.getEntityAuditLogs = async (req, res) => {
  try {
    const { tableName, recordId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const logs = await AuditLog.findAndCountAll({
      where: {
        table_name: tableName,
        record_id: recordId
      },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: User,
        as: 'performer',
        attributes: ['id', 'username', 'email']
      }]
    });

    // Log this view action
    await createAuditLog({
      action: 'VIEW_ENTITY_LOGS',
      tableName,
      recordId,
      changes: { query: { page, limit } },
      req
    });

    res.status(200).json({
      logs: logs.rows,
      totalLogs: logs.count,
      totalPages: Math.ceil(logs.count / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error retrieving entity audit logs:', error);
    res.status(500).json({ message: 'Error retrieving entity audit logs', error: error.message });
  }
};

// Get audit logs by user
exports.getUserAuditLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const logs = await AuditLog.findAndCountAll({
      where: {
        performed_by_id: userId
      },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: User,
        as: 'performer',
        attributes: ['id', 'username', 'email']
      }]
    });

    // Log this view action
    await createAuditLog({
      action: 'VIEW_USER_LOGS',
      tableName: 'users',
      recordId: userId,
      changes: { query: { page, limit } },
      req
    });

    res.status(200).json({
      logs: logs.rows,
      totalLogs: logs.count,
      totalPages: Math.ceil(logs.count / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error retrieving user audit logs:', error);
    res.status(500).json({ message: 'Error retrieving user audit logs', error: error.message });
  }
};
