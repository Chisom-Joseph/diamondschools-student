const Joi = require("joi");

const adminValidationSchema = Joi.object({
  registrationNumber: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required.",
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
  rememberMe: Joi.string().allow(),
});

module.exports = adminValidationSchema;
