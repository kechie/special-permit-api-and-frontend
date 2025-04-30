module.exports = (sequelize, DataTypes) => {
  const Permit = sequelize.define('Permit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    applicant_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    applicant_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    applicant_contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    applicant_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicant_id_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    applicant_id_type: {
      type: DataTypes.ENUM('government', 'school', 'company', 'other'),
      allowNull: true
    },
    product_or_service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    business_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permit_type: {
      type: DataTypes.ENUM('peddler', 'special'),
      allowNull: false
    },
    application_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'released'),
      defaultValue: 'pending'
    },
    business_tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    peddlers_tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 181.50,
      validate: { min: 0 }
    },
    mayors_permit_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 200.00,
      validate: { min: 0 }
    },
    individual_mayors_permit_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 200.00,
      validate: { min: 0 }
    },
    health_certificate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 375.00,
      validate: { min: 0 }
    },
    laboratory: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    sanitary_permit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 150.00,
      validate: { min: 0 }
    },
    garbage_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 150.00,
      validate: { min: 0 }
    },
    sticker_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    number_of_employees: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    amount_due: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    or_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate: (permit) => {
        // Enforce peddler rules
        if (permit.permit_type === 'peddler') {
          permit.number_of_employees = 1;
          permit.business_tax = 0.00;
          permit.peddlers_tax = 181.50;
          permit.mayors_permit_fee = 200.00;
          permit.individual_mayors_permit_fee = 200.00; // 1 employee
          permit.health_certificate = 375.00; // Fixed for peddler
          permit.sanitary_permit = 150.00;
          permit.garbage_fee = 150.00;
          permit.sticker_fee = 0.00;
        }
        // Calculate amount_due
        permit.amount_due = (
          Number(permit.business_tax || 0) +
          Number(permit.peddlers_tax || 0) +
          Number(permit.mayors_permit_fee || 0) +
          Number(permit.individual_mayors_permit_fee || 0) +
          Number(permit.health_certificate || 0) +
          Number(permit.laboratory || 0) +
          Number(permit.sanitary_permit || 0) +
          Number(permit.garbage_fee || 0) +
          Number(permit.sticker_fee || 0)
        ).toFixed(2);
      },
      beforeUpdate: (permit) => {
        // Enforce peddler rules
        if (permit.permit_type === 'peddler') {
          permit.number_of_employees = 1;
          permit.business_tax = 0.00;
          permit.peddlers_tax = 181.50;
          permit.mayors_permit_fee = 200.00;
          permit.individual_mayors_permit_fee = 200.00; // 1 employee
          permit.health_certificate = 375.00; // Fixed for peddler
          permit.sanitary_permit = 150.00;
          permit.garbage_fee = 150.00;
          permit.sticker_fee = 0.00;
        }
        // Calculate amount_due
        permit.amount_due = (
          Number(permit.business_tax || 0) +
          Number(permit.peddlers_tax || 0) +
          Number(permit.mayors_permit_fee || 0) +
          Number(permit.individual_mayors_permit_fee || 0) +
          Number(permit.health_certificate || 0) +
          Number(permit.laboratory || 0) +
          Number(permit.sanitary_permit || 0) +
          Number(permit.garbage_fee || 0) +
          Number(permit.sticker_fee || 0)
        ).toFixed(2);
        // Update status when payment is complete
        if (permit.amount_paid &&
          parseFloat(permit.amount_paid) >= parseFloat(permit.amount_due) &&
          permit.or_number) {
          permit.status = 'released';
        }
      }
    }
  });

  return Permit;
};