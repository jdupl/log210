var User = require('../models/user');
var mongoose = require('mongoose');
var data = require('../test/utils/data');
var config = require('../config/config');

mongoose.connect(config.db.url);

function addAdmin(cb) {
  User.remove({type: config.types.ADMIN}, function(err, admins) {
    User.create(data.admin_user, function(err, createdUser) {
      cb();
    });
  })
}

function addRestaurateur(cb) {
  User.remove({email: 'restaurateur@test.com'}, function(err, restaurateur) {
    User.create(data.restaurateur_user, function(err, createdUser) {
      cb();
    });
  });
}

addAdmin(
  addRestaurateur(function() {
    mongoose.connection.close();
    process.exit();
  });
)
