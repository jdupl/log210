var User = require('../models/user');
var mongoose = require('mongoose');
var data = require('../test/utils/data');
var config = require('../config/config');

mongoose.connect(config.db.url);

User.remove({type: config.types.ADMIN}, function(err, admins) {
  User.create(data.admin_user, function(err, createdUser) {
    mongoose.connection.close();
    process.exit();
  });
});
