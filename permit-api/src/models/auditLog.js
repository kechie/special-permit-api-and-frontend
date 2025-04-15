// models/auditLog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW'),
      allowNull: false,
    },
    performed_by: {
      type: DataTypes.STRING,
      allowNull: true, // Stores username, null if not available
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    performed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    indexes: [
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['performed_by'] },
      { fields: ['performed_at'] },
    ],
  });

  return AuditLog;
};