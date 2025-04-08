const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const expiresIn = '1h';

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = {
    generateToken,
    verifyToken,
};