const Joi = require('joi');

const dishValidatorSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string().required()).required(),
  diet: Joi.string().valid('Vegetarian', 'Non-vegetarian').required(),
  preptime: Joi.number(),
  cooktime: Joi.number(),
  flavorprofile: Joi.string().valid('Sweet', 'Spicy', 'Bitter', 'Sour'),
  course: Joi.string().valid('Dessert', 'Main course', 'Starter', 'Snack').required(),
  state: Joi.number(),
  region: Joi.string().valid('East', 'West', 'North', 'North East', 'South', 'Central')
});

module.exports = {
  dishValidatorSchema
}