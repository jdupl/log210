var User = require('../models/user');

exports.create = function(req, res) {
  User.create(req.body, function(err, created) {
    if (validateBody(created)) {
      res.status(201).json({user: {_id: created._id}});
    } else {
      res.status(400).json({'message': 'Invalid payload'});
    }
  });
};

exports.getUser = function(req, res) {
  User.findOne({_id: req.params.id}, function(err, user) {
    res.status(200).json({email: user.email,
      type: user.type,
      name: user.name,
      phone: user.phone,
      birth_date: user.birth_date,
      address: user.address});
  });
};

function validateBody(body) {
  return body.email && body.password && body.type && body.name && body.phone &&
    body.address && body.birth_date;
}
