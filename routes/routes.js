var loginMiddleware = require('../middleware/login');

var Joi = require('joi');
var userPayloadValidation = require('../middleware/validation/user');

var usersController = require('../controllers/users');
var loginController = require('../controllers/login');
var restaurantsController = require('../controllers/restaurants');

module.exports = function(app) {
  //Login routes
  app.post('/api/login/', loginController.getToken);
  app.get('/api/profile/', loginMiddleware.verify, loginController.getProfile);

  //Users routes
  app.post('/api/users/', loginMiddleware.verify, userPayloadValidation, usersController.create);
  app.get('/api/users/', loginMiddleware.verify, usersController.getUsers);
  app.put('/api/users/:id', loginMiddleware.verify, userPayloadValidation, usersController.updateUser);
  app.delete('/api/users/:id', loginMiddleware.verify, usersController.deleteUser);
  app.get('/api/users/:id/restaurants/', loginMiddleware.verify, usersController.getRestaurants);

  //Restaurants routes
  app.get('/api/restaurants/', loginMiddleware.verify, restaurantsController.getRestaurants);
  app.get('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.getRestaurant);
  app.get('/api/restaurants/:id/users', restaurantsController.getRestaurateur);
  app.post('/api/restaurants/', loginMiddleware.verify, restaurantsController.createRestaurant);
  app.delete('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.deleteRestaurant);
  app.put('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.updateRestaurant);
};
