var loginMiddleware = require('../middleware/login');

var Joi = require('joi');
var userPayloadValidation = require('../middleware/validation/user');

var usersController = require('../controllers/users');
var loginController = require('../controllers/login');
var restaurantsController = require('../controllers/restaurants');
var menusController = require('../controllers/menus');
var ordersController = require('../controllers/orders');
var paypalController = require('../controllers/paypal');
var paypal = require('paypal-rest-sdk');

var config = {};

//SDK Configuration
exports.init = function(c) {
	config = c;
	paypal.configure(c.api);
};

module.exports = function(app) {
  //Login routes
  app.post('/api/login/', loginController.getToken);
  app.get('/api/profile/', loginMiddleware.verify, loginController.getProfile);
  app.get('/api/profile/addresses', loginMiddleware.verify, loginController.getAddresses);
  app.get('/api/profile/orders', loginMiddleware.verify, loginController.getOrders);
  app.get('/api/profile/restaurants', loginMiddleware.verify, loginController.getRestaurants);

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
  app.get('/api/restaurants/:id/menus', loginMiddleware.verify, restaurantsController.getMenus);
  app.post('/api/restaurants/', loginMiddleware.verify, restaurantsController.createRestaurant);
  app.delete('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.deleteRestaurant);
  app.put('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.updateRestaurant);

  //Menu routes
  app.post('/api/menus', loginMiddleware.verify, menusController.create);

  //Order routes
  app.post('/api/orders', loginMiddleware.verify, ordersController.create);
  app.put('/api/orders/:id', loginMiddleware.verify, ordersController.update);
  app.get('/api/orders', loginMiddleware.verify, ordersController.getAll);

  // paypal
  app.get('/api/createPayment/:total', loginMiddleware.verify, paypalController.createPayment);
  app.get('/api/cancelPayment', loginMiddleware.verify, paypalController.cancelPayment);
  app.get('/api/executePayment', paypalController.executePayment);
};
