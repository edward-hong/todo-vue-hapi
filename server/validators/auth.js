const Joi = require('joi')

exports.userSignupValidator = {
  payload: Joi.object({
    name: Joi.string().min(1).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
}
