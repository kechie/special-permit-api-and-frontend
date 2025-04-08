const Permit = require('../models/permit');

// Create a new permit
exports.createPermit = async (req, res) => {
  try {
    const permitData = req.body;
    const newPermit = await Permit.create(permitData);
    res.status(201).json(newPermit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating permit', error });
  }
};

// Get all permits
exports.getAllPermits = async (req, res) => {
  try {
    const permits = await Permit.findAll();
    res.status(200).json(permits);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving permits', error });
  }
};

// Get a permit by ID
exports.getPermitById = async (req, res) => {
  try {
    const { id } = req.params;
    const permit = await Permit.findById(id);
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
    const updatedPermit = await Permit.update(id, permitData);
    if (!updatedPermit) {
      return res.status(404).json({ message: 'Permit not found' });
    }
    res.status(200).json(updatedPermit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating permit', error });
  }
};

// Delete a permit by ID
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPermit = await Permit.delete(id);
    if (!deletedPermit) {
      return res.status(404).json({ message: 'Permit not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting permit', error });
  }
};