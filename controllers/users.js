var User = require('../models/user');
var config = require('../config/config');

exports.create = function(req, res) {
  payload = req.body;

  if (!payload.type) {
    payload.type = config.types.CLIENT;
  }

  if (validateBody(payload)) {
    if (req.user.type == config.types.ANONYMOUS && payload.type != config.types.CLIENT) {
      res.status(401).json({message: 'You cannot create a user of type ' + payload.type + ', you are a visitor'});
    } else {
      User.create(payload, function(err, created) {
        res.status(201).json({user: {_id: created._id}});
      });
    }
  } else {
    res.status(400).json({'message': 'Invalid payload'});
  }
};

exports.getUsers = function(req, res) {
  if(req.user.type === config.types.ADMIN) {
    User.find(function(err, users) {
      res.status(200).json(users);
    });
  } else {
      res.status(200).json(req.user);
  }
};

exports.updateUser = function(req, res) {
  user = req.body;
  delete user._id;

  User.update({_id: req.user._id}, user, function(err, updated) {
    res.status(200).json({message: 'User updated'});
  });
};

function validateBody(body) {
  return body.email && body.password && body.type && body.name && body.phone &&
    body.address && body.birth_date;
}
