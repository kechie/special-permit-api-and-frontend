// migrations/YYYYMMDDHHMMSS-create-audit-log.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW'),
        allowNull: false,
      },
      performed_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      performed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('AuditLogs', ['entity_type', 'entity_id']);
    await queryInterface.addIndex('AuditLogs', ['performed_by']);
    await queryInterface.addIndex('AuditLogs', ['performed_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AuditLogs');
  },
};