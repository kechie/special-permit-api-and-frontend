module.exports = (sequelize, DataTypes) => {
  const Permit = sequelize.define('Permit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    description: DataTypes.TEXT,
    validFrom: DataTypes.DATE,
    validTo: DataTypes.DATE
  });

  return Permit;
};