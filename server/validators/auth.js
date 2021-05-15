const Joi = require('joi')

exports.userSignupValidator = {
  payload: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
}

exports.userActivationValidator = {
  payload: Joi.object({
    token: Joi.string().required(),
  }),
}
