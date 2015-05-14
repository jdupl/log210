var passport = require('passport');
var loginMiddleware = require('../middleware/login');
var usersController = require('../controllers/users');
var loginController = require('../controllers/login');

module.exports = function(app) {
  app.post('/api/users/', loginMiddleware.verify, usersController.create);
  app.post('/api/login/', loginController.getToken);
  app.get('/api/users/', passport.authenticate('jwt', {session: false}), usersController.getUsers);
  app.put('/api/users/:id', passport.authenticate('jwt', {session: false}), usersController.updateUser);
};
