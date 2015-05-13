var User = require('../models/user');
const ADMIN = 'admin';

exports.create = function(req, res) {
  User.create(req.body, function(err, created) {
    if (validateBody(created)) {
      res.status(201).json({user: {_id: created._id}});
    } else {
      res.status(400).json({'message': 'Invalid payload'});
    }
  });
};

exports.getUsers = function(req, res) {
  if(req.user.type === ADMIN) {
    User.find(function(err, users) {
      res.status(200).json(users);
    });
  } else {
      res.status(200).json(req.user);
  }
};

exports.updateUser = function(req, res) {
  if(req.user._id == req.params.id) {
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
