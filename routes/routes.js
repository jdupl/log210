var loginMiddleware = require('../middleware/login');
var usersController = require('../controllers/users');
var loginController = require('../controllers/login');
var restaurantsController = require('../controllers/restaurants');

module.exports = function(app) {
  app.post('/api/login/', loginController.getToken);
  app.get('/api/profile/', loginMiddleware.verify, loginController.getProfile);

  app.post('/api/users/', loginMiddleware.verify, usersController.create);
  app.get('/api/users/', loginMiddleware.verify, usersController.getUsers);
  app.put('/api/users/:id', loginMiddleware.verify, usersController.updateUser);
  app.get('/api/users/:id/restaurants/', loginMiddleware.verify, usersController.getRestaurants);

  //app.get('/api/restaurants/', loginMiddleware.verify, restaurantsController.getRestaurants);
  //app.get('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.getRestaurant);
  app.post('/api/restaurants/', loginMiddleware.verify, restaurantsController.createRestaurant);
  app.delete('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.deleteRestaurant);
  app.put('/api/restaurants/:id', loginMiddleware.verify, restaurantsController.updateRestaurant);
};
