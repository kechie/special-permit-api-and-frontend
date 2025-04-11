const { Op } = require('sequelize');
const { Permit } = require('../models');

// Create a new permit
exports.createPermit = async (req, res) => {
  try {
    const permitData = req.body;
    const newPermit = await Permit.create(permitData);
    res.status(201).json(newPermit);
  } catch (error) {
    console.error('Error creating permit:', error);
    res.status(500).json({ message: 'Error creating permit', error: error.message || error });
  }
};

// Get all permits
exports.getAllPermits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || '';

    const whereCondition = {
      [Op.or]: [
        { applicant_name: { [Op.like]: `%${search}%` } },
        { permit_type: { [Op.like]: `%${search}%` } },
        { issue_date: { [Op.like]: `%${search}%` } },
      ]
    };

    const permits = await Permit.findAll({
      where: search ? whereCondition : undefined,
      limit,
      offset,
    });

    const totalPermits = await Permit.count({ where: search ? whereCondition : undefined });

    res.status(200).json({
      permits,
      totalPages: Math.ceil(totalPermits / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving permits', error });
  }
};

// Get a permit by ID
exports.getPermitById = async (req, res) => {
  try {
    const { id } = req.params;
    const permit = await Permit.findByPk(id);
    if (!permit) {
      return res.status(404).json({ message: 'Permit not found' });
    }
    res.status(200).json(permit);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving permit', error });
  }
};

// Update a permit by ID
exports.updatePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const permitData = req.body;
    const [updatedRows] = await Permit.update(permitData, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const updatedPermit = await Permit.findByPk(id);
    res.status(200).json(updatedPermit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating permit', error });
  }
};

// Delete a permit by ID
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Permit.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting permit', error });
  }
};
