var User = require('../models/user');

exports.create = function(req, res) {
  User.create(req.body, function(err, created) {
    res.status(201).json({});
  });
};
