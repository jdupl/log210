var Joi = require('joi');

module.exports = function(req, res, next) {
  var rules = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string(),
    address: Joi.any(),
    birth_date: Joi.any(),
    phone: Joi.any(),
    restaurants: Joi.any(),
  };
  var options = {
    stripUnknown: true
  };
  Joi.validate(req.body, rules, options, function(err, value) {
    if (err) {
      res.status(400).json(err);
    } else {
      req.body = value;
      next();
    }
  });
};
