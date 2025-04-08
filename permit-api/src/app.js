const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const permitRoutes = require('./routes/permits');

const app = express();
const API_PORT = process.env.API_PORT || 3021;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/permits', permitRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(API_PORT, () => {
    console.log(`Server is running on port ${API_PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});