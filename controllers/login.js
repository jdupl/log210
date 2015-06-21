var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

exports.getToken = function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          var token = jwt.sign(user._id, config.jwt.secret);
          res.status(200).json({token: token});
        } else {
          res.status(400).json({message: 'invalid password'});
        }
      });
    } else {
      res.status(400).json({message: 'user not found'});
    }
  });
};

exports.getProfile = function(req, res) {
  res.status(200).json(req.user);
};

exports.getAddresses = function(req, res) {
  var addresses = [];
  addresses[0] = req.user.address;
  addresses.push.apply(addresses, req.user.optional_addresses);
  res.status(200).json(addresses);
};
