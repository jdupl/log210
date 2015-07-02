var User = require('../models/user');
var Restaurant = require('../models/restaurant');
var Menu = require('../models/menu');
var Plate = require('../models/plate');
var mongoose = require('mongoose');
var data = require('../test/utils/data');
var config = require('../config/config');
var extend = require('extend');

mongoose.connect(config.db.url);

function addAdmin(cb) {
  User.remove({type: config.types.ADMIN}, function(err, admins) {
    User.create(data.admin_user, cb);
  })
};

function addClient(cb) {
  User.remove({email: 'client@test.com'}, function(err, client) {
    User.create(data.client_user, cb);
  });
};

function addRestaurateur(cb) {
  User.remove({email: 'restaurateur@test.com'}, function(err, restaurateur) {
    addRestaurant(function(err, createdRestaurant) {
      var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
      test_restaurateur.restaurants = [createdRestaurant._id];
      User.create(test_restaurateur, cb);
    });
  });
};

function addRestaurant(cb) {
  Restaurant.remove({name: 'test-restaurant'}, function(err, restaurant) {
    addMenu(function(err, createdMenu) {
        var test_restaurant = extend(test_restaurant, data.test_restaurant);
        test_restaurant.menus = [createdMenu];
        Restaurant.create(test_restaurant, cb);
    });
  });
};

function addMenu(cb) {
  Menu.remove({name: 'test-menu'}, function(err, menu) {
    addPlate(function(err, createdPlate) {
      var test_menu = extend(test_menu, data.test_empty_menu);
      test_menu.plates = [createdPlate._id];
      Menu.create(test_menu, cb);
    });
  });
};

function addPlate(cb) {
  Plate.remove({name: 'test-plate'}, function(err, plate) {
    Plate.create(data.test_plate, cb);
  });
};

addAdmin(function(err, createdAdmin) {
  addRestaurateur(function(err, createdRestaurateur) {
    addClient(function(err, createdClient) {
      mongoose.connection.close();
      process.exit();
    });
  });
});
