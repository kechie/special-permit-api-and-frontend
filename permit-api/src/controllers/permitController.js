const { Permit } = require('../models'); // Adjust the path based on your folder structure


// Create a new permit
exports.createPermit = async (req, res) => {
  try {
    const {
      applicant_name,
      permit_type,
      issue_date,
      expiration_date,
      business_tax,
      mayors_permit_fee,
      individual_mayors_permit_fee,
      health_certificate,
      laboratory,
      sanitary_permit,
      garbage_fee,
      sticker_fee
    } = req.body;
    const permitData = req.body;
    const newPermit = await Permit.create(permitData);
    // Create a new permit
    /*     const newPermit = await Permit.create({
          applicant_name,
          permit_type,
          issue_date,
          expiration_date,
          business_tax,
          mayors_permit_fee,
          individual_mayors_permit_fee,
          health_certificate,
          laboratory,
          sanitary_permit,
          garbage_fee,
          sticker_fee
        });
     */    //const permitData = req.body;
    //const newPermit = await Permit.create(permitData);
    res.status(201).json(newPermit);
    //res.status(201).json(newPermit);
  } catch (error) {
    console.error('Error creating permit:', error);
    res.status(500).json({ message: 'Error creating permit', error: error.message || error });
    //    res.status(500).json({ message: 'Error creating permit', error });
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
    const permit = await Permit.findByPk(id);  // Use findByPk instead of findById
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
    const [updatedRows] = await Permit.update(permitData, { where: { id } });  // Proper update method

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    const updatedPermit = await Permit.findByPk(id);  // Retrieve updated permit
    res.status(200).json(updatedPermit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating permit', error });
  }
};

// Delete a permit by ID
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Permit.destroy({ where: { id } });  // Use destroy method

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.status(204).send();  // Return a 204 No Content status after successful deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting permit', error });
  }
};

/* const Permit = require('../models');

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
}; */