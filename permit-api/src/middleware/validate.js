module.exports = (req, res, next) => {
    const { body } = req;

    // Validate permit data
    if (!body.name || typeof body.name !== 'string') {
        return res.status(400).json({ error: 'Invalid permit name' });
    }
    if (!body.description || typeof body.description !== 'string') {
        return res.status(400).json({ error: 'Invalid permit description' });
    }
    if (!body.expiryDate || isNaN(Date.parse(body.expiryDate))) {
        return res.status(400).json({ error: 'Invalid expiry date' });
    }

    next();
};