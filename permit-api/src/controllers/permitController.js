// controllers/permitController.js
// This file contains the controller functions for handling permit-related API requests.
// It includes functions for creating, retrieving, updating, and deleting permits,
// as well as for retrieving audit logs related to permits.
const { Op, Sequelize } = require('sequelize');
const { Permit, AuditLog } = require('../models');

// Helper function to create an audit log
const createAuditLog = async ({ entityId, action, performedBy, changes, ipAddress }) => {
  try {
    await AuditLog.create({
      entity_type: 'Permit',
      entity_id: entityId,
      action,
      performed_by: performedBy || 'anonymous',
      changes,
      ip_address: ipAddress || null,
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

    // Log VIEW action (optional, can skip for performance)
    await createAuditLog({
      entityId: null,
      action: 'VIEW',
      performedBy: req.user?.username,
      changes: { query: { page, limit, search } },
      ipAddress: req.ip,
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
    const permitData = req.body;
    if (!permitData.applicant_name || !permitData.permit_type || !permitData.application_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newPermit = await Permit.create(permitData);

    await createAuditLog({
      entityId: newPermit.id,
      action: 'CREATE',
      performedBy: req.user?.username,
      changes: { new: newPermit.toJSON() },
      ipAddress: req.ip,
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

    await createAuditLog({
      entityId: id,
      action: 'VIEW',
      performedBy: req.user?.username,
      changes: null,
      ipAddress: req.ip,
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

    await createAuditLog({
      entityId: id,
      action: 'UPDATE',
      performedBy: req.user?.username,
      changes: {
        old: existingPermit.toJSON(),
        new: updatedPermit.toJSON(),
      },
      ipAddress: req.ip,
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
      entityId: id,
      action: 'DELETE',
      performedBy: req.user?.username,
      changes: { old: existingPermit.toJSON() },
      ipAddress: req.ip,
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
      entityId: id,
      action: 'VIEW',
      performedBy: req.user?.username,
      changes: { query: 'audit_logs' },
      ipAddress: req.ip,
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    res.status(500).json({ message: 'Error retrieving audit logs', error: error.message });
  }
};

/* const { Op, Sequelize } = require('sequelize');
const { Permit } = require('../models');

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

      // Valid ENUM values
      const validPermitTypes = ['peddler', 'special'];
      const validStatuses = ['pending', 'approved', 'rejected'];

      if (!isDate) {
        // String-based search
        // Always search applicant_name
        conditions.push({ applicant_name: { [Op.iLike]: `%${search}%` } });

        // Only include permit_type if search matches a valid ENUM value
        if (validPermitTypes.includes(search.toLowerCase())) {
          conditions.push({ permit_type: { [Op.eq]: search.toLowerCase() } });
        }

        // Only include status if search matches a valid ENUM value
        if (validStatuses.includes(search.toLowerCase())) {
          conditions.push({ status: { [Op.eq]: search.toLowerCase() } });
        }
      } else {
        // Date-based search
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
      paranoid: true, // Respect soft deletes
      order: [['application_date', 'DESC']], // Sort by application_date ascending
    });

    const totalPermits = await Permit.count({
      where: whereCondition,
      paranoid: true,
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
    const permitData = req.body;
    // Optional: Add basic validation
    if (!permitData.applicant_name || !permitData.permit_type || !permitData.application_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newPermit = await Permit.create(permitData);
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
    const [updatedRows] = await Permit.update(permitData, {
      where: { id },
      paranoid: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const updatedPermit = await Permit.findByPk(id, { paranoid: true });
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
    const deletedRows = await Permit.destroy({
      where: { id },
      paranoid: true,
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting permit:', error);
    res.status(500).json({ message: 'Error deleting permit', error: error.message });
  }
}; */