// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const db = {
  sequelize,
  Sequelize
};

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Permit = require('./permit')(sequelize, Sequelize);
db.AuditLog = require('./auditLog')(sequelize, Sequelize);

// No User-Permit associations
// Define associations for AuditLog if needed in the future
// db.User.hasMany(db.AuditLog, { foreignKey: 'performed_by' }); // Not used since performed_by is a string

// Sync database (development only)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Sync failed:', err));
}

// Sync database (development only)
if (process.env.NODE_ENV === 'production') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Sync failed:', err));
}

module.exports = db;
/* const { Sequelize } = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const db = {
  sequelize,
  Sequelize
};

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Permit = require('./permit')(sequelize, Sequelize);

// Define associations
//db.User.hasMany(db.Permit);
//db.Permit.belongsTo(db.User);

// Sync database (development only)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Sync failed:', err));
}

module.exports = db; */
