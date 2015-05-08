var passport = require('passport');
var usersController = require('../controllers/users');
var loginController = require('../controllers/login');

module.exports = function(app) {
  app.post('/api/users/', usersController.create);
  app.post('/api/login/', loginController.getToken);
  app.get('/api/users/:id', passport.authenticate('jwt', {session: false}), usersController.getUser);
};
