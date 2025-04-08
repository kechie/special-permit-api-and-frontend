const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { JWT_SECRET } = require('../config/jwt');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};