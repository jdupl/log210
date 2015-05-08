var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'secret';

exports.getToken = function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          var token = jwt.sign(user._id, secret);
          res.status(200).json({token: token});
        } else {
          //TODO Coverage
          res.status(400).json({message: 'invalid password'});
        }
      });
    } else {
      res.status(400).json({message: 'user not found'});
    }
  });
};
