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

exports.userSigninValidator = {
  payload: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
  }),
}

exports.userForgotValidator = {
  payload: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
}
