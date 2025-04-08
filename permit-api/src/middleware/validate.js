// validate.js

const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};

// module.exports = (req, res, next) => {
//     const { body } = req;

//     // Validate permit data
//     if (!body.name || typeof body.name !== 'string') {
//         return res.status(400).json({ error: 'Invalid permit name' });
//     }
//     if (!body.description || typeof body.description !== 'string') {
//         return res.status(400).json({ error: 'Invalid permit description' });
//     }
//     if (!body.expiryDate || isNaN(Date.parse(body.expiryDate))) {
//         return res.status(400).json({ error: 'Invalid expiry date' });
//     }

//     next();
// };