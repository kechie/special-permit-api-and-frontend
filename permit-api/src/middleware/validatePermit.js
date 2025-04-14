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

  // Sanitize empty strings to null for date fields
  req.body.issue_date = issue_date === '' ? null : issue_date;
  req.body.expiration_date = expiration_date === '' ? null : expiration_date;

  if (!applicant_name || typeof applicant_name !== 'string') {
    return res.status(400).json({ error: 'Invalid applicant name' });
  }

  if (!permit_type || !['peddler', 'special'].includes(permit_type)) {
    return res.status(400).json({ error: 'Invalid permit type' });
  }

  if (
    req.body.issue_date !== null &&
    isNaN(Date.parse(req.body.issue_date))
  ) {
    return res.status(400).json({ error: 'Invalid issue date' });
  }

  if (
    req.body.expiration_date !== null &&
    isNaN(Date.parse(req.body.expiration_date))
  ) {
    return res.status(400).json({ error: 'Invalid expiration date' });
  }

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

  for (const field of feeFields) {
    const value = req.body[field];
    if (value !== null && value !== undefined && (typeof value !== 'number' || value < 0)) {
      return res.status(400).json({ error: `Invalid value for ${field}` });
    }
  }

  next();
};

module.exports = validatePermit;
