//models/permit.js
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
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    business_tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    mayors_permit_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    individual_mayors_permit_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    health_certificate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    laboratory: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    sanitary_permit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    garbage_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    sticker_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  return Permit;
};