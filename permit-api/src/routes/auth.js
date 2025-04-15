const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validate');

// Registration route
// router.post('/register', validateRegistration, authController.register);

// Registration route (disabled in production)
if (process.env.NODE_ENV !== 'production') {
  router.post('/register', validateRegistration, authController.register);
}

// Login route
router.post('/login', validateLogin, authController.login);

module.exports = router;