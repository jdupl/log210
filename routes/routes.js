var loginMiddleware = require('../middleware/login');
var usersController = require('../controllers/users');
var loginController = require('../controllers/login');
var restaurantsController = require('../controllers/restaurants');

module.exports = function(app) {
  app.post('/api/users/', loginMiddleware.verify, usersController.create);
  app.post('/api/login/', loginController.getToken);
  app.get('/api/users/', loginMiddleware.verify, usersController.getUsers);
  app.put('/api/users/:id', loginMiddleware.verify, usersController.updateUser);
  app.post('/api/restaurants', loginMiddleware.verify, restaurantsController.createRestaurant);
};
