var User = require('../models/user');
var Restaurant = require('../models/restaurant');
var config = require('../config/config');

exports.create = function(req, res) {
  payload = req.body;

  if (!payload.type) {
    payload.type = config.types.CLIENT;
  }

  if (req.user.type == config.types.ANONYMOUS && payload.type != config.types.CLIENT) {
    res.status(401).json({message: 'You cannot create a user of type ' + payload.type + ', you are a visitor'});
  } else {
    User.create(payload, function(err, created) {
      res.status(201).json({user: {_id: created._id}});
    });
  }
};

exports.getUsers = function(req, res) {
  var type = req.query.type;
  if(req.user.type === config.types.ADMIN) {
    if (type) {
      User.find({type: type}, function(err, users) {
        res.status(200).json(users);
      });
    } else {
      User.find(function(err, users) {
        res.status(200).json(users);
      });
    }
  } else {
      res.status(401).json({message: 'Only the administrator can list the users'});
  }
};

exports.updateUser = function(req, res) {
  if (req.params.id == req.user._id) {
    User.update({_id: req.params.id}, req.body, function(err, updated) {
      res.status(200).json({message: 'User updated'});
    });
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
};

exports.getRestaurants = function(req, res) {
  Restaurant.find({restaurateur: req.params.id}, function(err, restaurant) {
    res.status(200).json(restaurant);
  });
};

function validateBody(body) {
  return body.email && body.password && body.type && body.name && body.phone &&
    body.address && body.birth_date;
}
