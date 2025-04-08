const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || '5029003f2d87148303149f514366396dfb3d31b86c8f9c9883e848f070aa6ef73033eda889582752ee5477664d2a71c5ffff0da5928f4f84be80df62fb5fd54d';
const expiresIn = '1d';

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