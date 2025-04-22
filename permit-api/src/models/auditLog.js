// models/auditLog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    record_id: {
      type: DataTypes.UUID,
      allowNull: false // for VIEW actions a dummy UUID is used
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    performed_by_id: {  // Changed from performed_by string to UUID
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  return AuditLog;
};