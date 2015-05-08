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

function validateBody(body) {
  return body.email && body.password && body.type && body.name && body.phone &&
    body.address && body.birth_date;
}
