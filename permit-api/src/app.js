const fs = require('fs');
const express = require('express');
const cors = require('cors');
const https = require('https'); // Added missing import
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const permitRoutes = require('./routes/permits');

const app = express();
const API_PORT = process.env.API_PORT || 3021;

// Only define tlsOptions in production
let tlsOptions;
if (process.env.NODE_ENV === 'production') {
  tlsOptions = {
    cert: fs.readFileSync(process.env.CERT_PATH || '/node-tls/fullchain.pem'),
    key: fs.readFileSync(process.env.KEY_PATH || '/node-tls/privkey.pem'),
  };
}

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || '*', // Restrict in production
  })
);
app.use(express.json()); // Replace body-parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/permits', permitRoutes);

app.get('/', (req, res) => {
  res.send(
    'Laoag DPS Citations API Server. Docs at <a href="https://apps.laoagcity.gov.ph/apidocs/dpscitations">API Docs</a>'
  );
});

// Sync database and start server
sequelize
  .sync({ force: false }) // Avoid schema changes in production
  .then(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode', NODE_ENV);
      https.createServer(tlsOptions, app).listen(API_PORT, () => {
        console.log(`Server is running on port ${API_PORT} with TLS`);
        console.log('Database connection established successfully.');
      });
    } else {
      app.listen(API_PORT, () => {
        console.log(`Server is running on port ${API_PORT} in ${process.env.NODE_ENV} mode`);
        console.log('Database connection established successfully.');
      });
    }
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
  });