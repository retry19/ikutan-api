const Joi = require('@hapi/joi')

/**
 * Register User Validation
 * @param {name, email, password} data 
 */
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
  return schema.validate(data)
}

/**
 * Login User Validation
 * @param {email, password} data 
 */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
  return schema.validate(data)
}

/**
 * Add event validation
 * @param {title, date, description, organizer} data 
 */
const addEventValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    place: Joi.string().required(),
    description: Joi.string().required(),
    quota: Joi.number().required(),
    organizer: Joi.required()
  })
  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.addEventValidation = addEventValidation