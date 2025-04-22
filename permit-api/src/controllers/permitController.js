// controllers/permitController.js
// This file contains the controller functions for handling permit-related API requests.
// It includes functions for creating, retrieving, updating, and deleting permits,
// as well as for retrieving audit logs related to permits.
const { Op, Sequelize } = require('sequelize');
const { Permit, AuditLog } = require('../models');
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

// Get all permits
exports.getAllPermits = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    let whereCondition = {};

    if (search) {
      const isDate = !isNaN(Date.parse(search));
      const conditions = [];

      const validPermitTypes = ['peddler', 'special'];
      const validStatuses = ['pending', 'approved', 'rejected'];

      if (!isDate) {
        conditions.push({ applicant_name: { [Op.iLike]: `%${search}%` } });
        if (validPermitTypes.includes(search.toLowerCase())) {
          conditions.push({ permit_type: { [Op.eq]: search.toLowerCase() } });
        }
        if (validStatuses.includes(search.toLowerCase())) {
          conditions.push({ status: { [Op.eq]: search.toLowerCase() } });
        }
      } else {
        const searchDate = new Date(search);
        conditions.push(
          { issue_date: { [Op.eq]: searchDate } },
          { expiration_date: { [Op.eq]: searchDate } }
        );
      }

      whereCondition = { [Op.or]: conditions };
    }

    const permits = await Permit.findAll({
      where: whereCondition,
      limit,
      offset,
      paranoid: true,
      order: [['application_date', 'DESC']],
    });

    const totalPermits = await Permit.count({
      where: whereCondition,
      paranoid: true,
    });

    //    Log VIEW action(optional, can skip for performance)
    await createAuditLog({
      action: 'VIEW',
      tableName: 'permits',
      recordId: '09ed8ed0-141f-4ed9-b494-65c1d940b67a', //dummy id
      //changes: { new: newPermit.toJSON() },
      req
    });

    res.status(200).json({
      permits,
      totalPages: Math.ceil(totalPermits / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error retrieving permits:', error);
    res.status(500).json({ message: 'Error retrieving permits', error: error.message });
  }
};

// Create a new permit
exports.createPermit = async (req, res) => {
  try {
    console.log(req.body);
    const permitData = req.body;
    if (!permitData.applicant_name || !permitData.permit_type || !permitData.application_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newPermit = await Permit.create(permitData);

    await createAuditLog({
      action: 'CREATE',
      tableName: 'permits',
      recordId: newPermit.id,
      changes: { new: newPermit.toJSON() },
      req
    });


    res.status(201).json(newPermit);
  } catch (error) {
    console.error('Error creating permit:', error);
    res.status(500).json({ message: 'Error creating permit', error: error.message });
  }
};

// Get a permit by ID
exports.getPermitById = async (req, res) => {
  try {
    const { id } = req.params;
    const permit = await Permit.findByPk(id, { paranoid: true });
    if (!permit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    // Log VIEW action (optional, can skip for performance)
    await createAuditLog({
      action: 'VIEW',
      tableName: 'permits',
      recordId: '09ed8ed0-141f-4ed9-b494-65c1d940b67a', //dummy id
      //changes: { new: newPermit.toJSON() },
      req
    });


    res.status(200).json(permit);
  } catch (error) {
    console.error('Error retrieving permit:', error);
    res.status(500).json({ message: 'Error retrieving permit', error: error.message });
  }
};

// Update a permit by ID
exports.updatePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const permitData = req.body;

    const existingPermit = await Permit.findByPk(id, { paranoid: true });
    if (!existingPermit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const [updatedRows] = await Permit.update(permitData, {
      where: { id },
      paranoid: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const updatedPermit = await Permit.findByPk(id, { paranoid: true });

    // Log UPDATE action (optional, can skip for performance)
    await createAuditLog({
      action: 'UPDATE',
      tableName: 'permits',
      recordId: id,
      changes: {
        old: existingPermit.toJSON(),
        new: updatedPermit.toJSON()
      },
      req
    });

    res.status(200).json(updatedPermit);
  } catch (error) {
    console.error('Error updating permit:', error);
    res.status(500).json({ message: 'Error updating permit', error: error.message });
  }
};

// Delete a permit by ID
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPermit = await Permit.findByPk(id, { paranoid: true });
    if (!existingPermit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const deletedRows = await Permit.destroy({
      where: { id },
      paranoid: true,
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    await createAuditLog({
      action: 'DELETE',
      tableName: 'permits',
      recordId: newPermit.id,
      changes: { new: newPermit.toJSON() },
      req
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting permit:', error);
    res.status(500).json({ message: 'Error deleting permit', error: error.message });
  }
};

// Get audit logs for a permit
exports.getPermitAuditLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await AuditLog.findAll({
      where: {
        entity_type: 'Permit',
        entity_id: id,
      },
      order: [['performed_at', 'DESC']],
    });

    await createAuditLog({
      action: 'VIEW_LOGS',
      tableName: 'permits',
      recordId: '09ed8ed0-141f-4ed9-b494-65c1d940b67a', //dummy id
      changes: { query: 'audit_logs' },
      req
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    res.status(500).json({ message: 'Error retrieving audit logs', error: error.message });
  }
};

