var Joi = require('joi');

module.exports = function(req, res, next) {
  var rules = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string(),
    address: Joi.string().required(),
    birth_date: Joi.date().required(),
    phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).required()
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
