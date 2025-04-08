module.exports = {
  generateResponse: (status, message, data = null) => {
    return {
      status,
      message,
      data
    };
  },

  validateInput: (input, schema) => {
    const { error } = schema.validate(input);
    return error ? error.details[0].message : null;
  },

  handleError: (error) => {
    console.error(error);
    return {
      status: 'error',
      message: 'An unexpected error occurred.'
    };
  }
};