var Menu = require('../../models/menu');
var Restaurant = require('../../models/restaurant');
var Plate = require('../../models/plate');
var User = require('../../models/user');

var app = require('../../app');
var client = require('supertest')(app);

var data = require('../utils/data');
var login = require('../utils/login');

var extend = require('extend');
var assert = require('assert');

describe('/api/menus', function() {
  describe('POST', function() {
    it('should create a menu and create a reference to it in the restaurant', function(done) {
      Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {

        var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
        var restaurants = [createdRestaurant._id];
        test_restaurateur.restaurants = restaurants;

        User.create(test_restaurateur, function(err, createdRestaurateur) {

          login.getToken(test_restaurateur.email, test_restaurateur.password, client, function(err, token) {

            var test_menu = extend(test_menu, data.test_menu);
            test_menu.restaurant = createdRestaurant._id;

            client
              .post('/api/menus')
              .set('Authorization', 'Bearer ' + token)
              .send(test_menu)
              .end(function(err, res) {
                assert.equal(res.status, 201);
                assert.equal(res.body.message, 'Menu created');

                Restaurant.findOne({_id: createdRestaurant._id}, function(err, restaurant) {
                  assert.equal(restaurant.menus.length, 1);
                  var menu_id = restaurant.menus[0];

                  Menu.findOne({_id: menu_id}, function(err, menu) {
                    assert.equal(menu.name, test_menu.name);
                    assert.equal(menu.plates.length, 2);
                    var plate_id = menu.plates[0];

                    Plate.findOne({_id: plate_id}, function(err, plate) {
                      var test_plate = test_menu.plates[0];
                      assert.equal(plate.name, test_plate.name);
                      assert.equal(plate.description, test_plate.description);
                      assert.equal(plate.price, test_plate.price);
                      done();
                    });
                  });
                });
              });
          });
        });
      });
    });
  });
});
