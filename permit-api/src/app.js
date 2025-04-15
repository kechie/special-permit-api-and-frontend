const fs = require('fs');
const express = require('express');
const cors = require('cors');
const https = require('https');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const permitRoutes = require('./routes/permits');

const app = express();
const API_PORT = process.env.API_PORT || 3021;

// Only define tlsOptions in production
let tlsOptions;
if (process.env.NODE_ENV === 'production') {
  try {
    tlsOptions = {
      cert: fs.readFileSync(process.env.CERT_PATH || '/node-tls/fullchain.pem'),
      key: fs.readFileSync(process.env.KEY_PATH || '/node-tls/privkey.pem'),
    };
  } catch (err) {
    console.error('Failed to load TLS certificates:', err.message);
    process.exit(1); // Exit if certificates are invalid
  }
}

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/permits', permitRoutes);

app.get('/', (req, res) => {
  res.send(
    'Special Permits API Server. Docs at <a href="https://apps.laoagcity.gov.ph/apidocs/dpscitations">API Docs</a>'
  );
});

// Sync database and start server
sequelize
  .authenticate() // Test connection before syncing
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ force: false }); // Sync models after connection
  })
  .then(() => {
    console.log('Database synchronized successfully.');
    console.log('API_PORT:', API_PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Secure HTTP:', tlsOptions ? 'Enabled' : 'Disabled');

    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode');
      https.createServer(tlsOptions, app).listen(API_PORT, () => {
        console.log(`Server is running on port ${API_PORT} with TLS`);
      });
    } else {
      app.listen(API_PORT, () => {
        console.log(`Server is running on port ${API_PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      });
    }
  })
  .catch((err) => {
    console.error('Error during database setup or server start:', err.message);
    process.exit(1); // Exit on failure
  });