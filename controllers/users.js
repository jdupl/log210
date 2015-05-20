var User = require('../models/user');

exports.create = function(req, res) {
  payload = req.body;

  if (!payload.type) {
    // TODO change this to a constant when the codestyle branch is merged in master
    payload.type = 'user';
  }
  // TODO reminder: check for admin if type is not user

  if (validateBody(payload)) {
    User.create(payload, function(err, created) {
      res.status(201).json({user: {_id: created._id}});
    });
  } else {
    res.status(400).json({'message': 'Invalid payload'});
  }
};

exports.getUsers = function(req, res) {
  res.status(200).json(req.user);
};

exports.updateUser = function(req, res) {
  if (req.user._id == req.params.id) {
    User.update({_id: req.params.id}, req.body, function(err, updated) {
      res.status(200).json({message: 'User updated'});
    });
  } else {
    res.status(401).json({message: 'You cannot modify another user\'s information'});
  }
};

function validateBody(body) {
  return body.email && body.password && body.type && body.name && body.phone &&
    body.address && body.birth_date;
}
