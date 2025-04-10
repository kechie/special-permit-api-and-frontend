const validatePermit = (req, res, next) => {
  const {
    applicant_name,
    permit_type,
    issue_date,
    expiration_date,
    business_tax,
    mayors_permit_fee,
    individual_mayors_permit_fee,
    health_certificate,
    laboratory,
    sanitary_permit,
    garbage_fee,
    sticker_fee
  } = req.body;

  // Validate applicant_name
  if (!applicant_name || typeof applicant_name !== 'string') {
    return res.status(400).json({ error: 'Invalid applicant name' });
  }

  // Validate permit_type (should be either 'peddler' or 'special')
  if (!permit_type || !['peddler', 'special'].includes(permit_type)) {
    return res.status(400).json({ error: 'Invalid permit type' });
  }

  // Validate issue_date and expiration_date
  if (!issue_date || isNaN(Date.parse(issue_date))) {
    return res.status(400).json({ error: 'Invalid issue date' });
  }

  if (!expiration_date || isNaN(Date.parse(expiration_date))) {
    return res.status(400).json({ error: 'Invalid expiration date' });
  }

  // Validate fee-related fields (should be numbers >= 0)
  const feeFields = [
    'business_tax',
    'mayors_permit_fee',
    'individual_mayors_permit_fee',
    'health_certificate',
    'laboratory',
    'sanitary_permit',
    'garbage_fee',
    'sticker_fee'
  ];

  for (let field of feeFields) {
    if (req.body[field] && (typeof req.body[field] !== 'number' || req.body[field] < 0)) {
      return res.status(400).json({ error: `Invalid value for ${field}` });
    }
  }

  next();
};

module.exports = validatePermit;
