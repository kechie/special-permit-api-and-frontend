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
// if (process.env.NODE_ENV !== 'production') {
//   sequelize.sync({ alter: true })
//     .then(() => console.log('Database synced'))
//     .catch((err) => console.error('Sync failed:', err));
// }

// Sync database (production) for initializing the database
// This is a one-time operation to set up the database schema
// and should not be run in production environments.
// In production, you should use migrations instead of syncing
// the database schema. 
// Uncomment the following lines if you want to sync the database in production
// but be cautious as this will alter the database schema.
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode. Syncing database...');
  sequelize.authenticate()
    .then(() => {
      console.log('Database connection established successfully.');

      return sequelize.sync({ force: false }); // Sync models after connection
    })
    .then(() => {
      console.log('Database synchronized successfully.');
      console.log('API_PORT:', API_PORT);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('Secure HTTP:', tlsOptions ? 'Enabled' : 'Disabled');
    })
    .catch((err) => {
      console.error('Failed to sync database:', err);
    });
} else {
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
