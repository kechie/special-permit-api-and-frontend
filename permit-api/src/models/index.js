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

// Define associations
//db.User.hasMany(db.Permit);
//db.Permit.belongsTo(db.User);

// Sync database (development only)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Sync failed:', err));
}

module.exports = db;
/* //models/index.js
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

// Define associations
db.User.hasMany(db.Permit);
db.Permit.belongsTo(db.User);

module.exports = db; */