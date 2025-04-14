const validateRegistration = (req, res, next) => {
  const { email, password, username, fullname, role } = req.body;

  // Check if all required fields are present
  if (!email || !password || !username || !fullname || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email validation (basic format check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password validation (ensure length is between 8 and 100 characters)
  if (password.length < 8 || password.length > 100) {
    return res.status(400).json({ message: 'Password must be between 8 and 100 characters' });
  }

  // Role validation (optional, depending on your requirements)
  const validRoles = ['user', 'cashier', 'assessment', 'monitor', 'admin', 'superadmin']; // Add other roles if necessary
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Email validation (basic format check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};
