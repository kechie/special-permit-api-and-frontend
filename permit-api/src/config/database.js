//file config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: 'postgres',
    sync: {
      force: false,  // Set to true to drop and recreate tables on each restart (useful in development)
      alter: true,   // Automatically adds new columns for any changes to your models
      logging: console.log // Enable logging of SQL queries
    }
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'postgres',
    sync: {
      force: true,  // Use true to drop tables and re-sync in test environment
      logging: false // Disable logging in test environment
    }
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: 'postgres',
    // Use SSL in production for secure connections
    // This is important for Heroku and other cloud providers
    // that require SSL connections to their databases
    // Note: You may need to adjust this based on your database provider
    // and its SSL requirements
    // For example, AWS RDS may require different settings
    // or additional certificates
    // For Heroku, you might need to set the `ssl` option to true
    // and provide the `rejectUnauthorized` option
    // to avoid certificate errors
    // For example:
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    //   }
    // }
    // For AWS RDS, you might need to set the `ca` option
    // to the certificate authority (CA) certificate
    // For example:
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //     ca: process.env.DB_CA_CERT
    //   }
    //   }
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    sync: {
      force: false,  // Never use force in production; tables should be pre-created
      alter: true,    // Allows for schema changes without dropping tables
      logging: false  // Disable logging in production
    }
  }
};
