var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');
var Menu = require('../../models/menu');
var Plate = require('../../models/plate');
var Item = require('../../models/item');
var Order = require('../../models/order');
var Delivery = require('../../models/delivery');

var app = require('../../app');
var client = require('supertest')(app);
var config = require('../../config/config');

var data = require('../utils/data');
var login = require('../utils/login');

var extend = require('extend');
var assert = require('assert');
var random = require('random-js');

describe('/api/orders', function() {
  describe('POST', function() {
    it('should create an order', function(done) {
      User.create(data.client_user, function(err, createdClient) {
        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var test_order = extend(test_order, data.test_order);
            test_order.restaurant = createdRestaurant._id;
            var test_item = extend(test_item, data.test_item);
            test_item.plate = createdPlate._id;
            var items = [test_item];
            test_order.items = items;

            login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {

              client
              .post('/api/orders')
              .set('Authorization', 'Bearer ' + token)
              .send(test_order)
              .end(function(err, res) {
                assert.equal(res.status, 201);
                var order = res.body;
                assert.equal(order.restaurant, createdRestaurant._id);
                assert.equal(order.status, config.status.ORDERED);
                assert.equal(order.client, createdClient._id);
                User.findOne({_id: createdClient._id}, function(err, user) {
                  assert.equal(user.address, order.delivery_address);
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
describe('/api/profile/orders', function() {
  describe('GET', function() {
    it('should get all the orders from all the restaurant of the logged in restaurateur', function(done) {
      User.create(data.client_user, function(err, createdClient) {

        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var restaurants = [createdRestaurant._id];
            var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
            test_restaurateur.restaurants = restaurants;

            User.create(test_restaurateur, function(err, createdRestaurateur) {
              plates = [createdPlate._id];
              var test_item = extend(test_item, data.test_item);

              Item.create(test_item, function(err, createdItem) {
                var items = [createdItem._id];
                var test_order = extend(test_order, data.test_order);
                test_order.client = createdClient._id;
                test_order.status = config.status.ORDERED;
                test_order.restaurant = createdRestaurant._id;
                test_order.items = items;

                Order.create(test_order, function(err, createdOrder) {

                  login.getToken(test_restaurateur.email, test_restaurateur.password, client, function(err, token) {
                    client
                    .get('/api/profile/orders')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.body.length, 1);
                      order = res.body[0];
                      assert.equal(order.client.name, createdClient.name);
                      assert.equal(order.status, config.status.ORDERED);
                      assert.equal(order.restaurant.name, createdRestaurant.name);
                      assert.equal(order.items.length, 1);
                      assert.equal(order.items[0], createdItem._id);
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
    it('should get all the orders of a logged in client', function(done) {
      User.create(data.client_user, function(err, createdClient) {

        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var restaurants = [createdRestaurant._id];
            var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
            test_restaurateur.restaurants = restaurants;

            User.create(test_restaurateur, function(err, createdRestaurateur) {
              plates = [createdPlate._id];
              var test_item = extend(test_item, data.test_item);

              Item.create(test_item, function(err, createdItem) {
                var items = [createdItem._id];
                var test_order = extend(test_order, data.test_order);
                test_order.client = createdClient._id;
                test_order.status = config.status.ORDERED;
                test_order.restaurant = createdRestaurant._id;
                test_order.items = items;

                Order.create(test_order, function(err, createdOrder) {

                  login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
                    client
                    .get('/api/profile/orders')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.body.length, 1);
                      order = res.body[0];
                      assert.equal(order.client, createdClient._id);
                      assert.equal(order.status, config.status.ORDERED);
                      assert.equal(order.restaurant, createdRestaurant._id);
                      assert.equal(order.items.length, 1);
                      assert.equal(order.items[0], createdItem._id);
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
});
describe('/api/orders/:id', function() {
  describe('PUT', function() {
    it('should only update the status of the order', function(done) {
      User.create(data.client_user, function(err, createdClient) {

        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var restaurants = [createdRestaurant._id];
            var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
            test_restaurateur.restaurants = restaurants;

            User.create(test_restaurateur, function(err, createdRestaurateur) {
              plates = [createdPlate._id];
              var test_item = extend(test_item, data.test_item);

              Item.create(test_item, function(err, createdItem) {
                var items = [createdItem._id];
                var test_order = extend(test_order, data.test_order);
                test_order.client = createdClient._id;
                test_order.status = config.status.ORDERED;
                test_order.restaurant = createdRestaurant._id;
                test_order.items = items;

                Order.create(test_order, function(err, createdOrder) {
                  var new_order = {
                    status: config.status.PREPARING
                  };

                  login.getToken(test_restaurateur.email, test_restaurateur.password, client, function(err, token) {
                    client
                    .put('/api/orders/' + createdOrder._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(new_order)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);

                      Order.findOne({_id: createdOrder._id}, function(err, order) {
                        assert.equal(order.status, new_order.status);
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
    it('should update the status and create a delivery', function(done) {
      User.create(data.client_user, function(err, createdClient) {

        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var restaurants = [createdRestaurant._id];
            var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
            test_restaurateur.restaurants = restaurants;

            User.create(test_restaurateur, function(err, createdRestaurateur) {
              plates = [createdPlate._id];
              var test_item = extend(test_item, data.test_item);

              Item.create(test_item, function(err, createdItem) {
                var items = [createdItem._id];
                var test_order = extend(test_order, data.test_order);
                test_order.client = createdClient._id;
                test_order.status = config.status.ORDERED;
                test_order.restaurant = createdRestaurant._id;
                test_order.items = items;

                Order.create(test_order, function(err, createdOrder) {
                  var new_order = {
                    status: config.status.READY
                  };

                  login.getToken(test_restaurateur.email, test_restaurateur.password, client, function(err, token) {
                    client
                    .put('/api/orders/' + createdOrder._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(new_order)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);

                      Order.findOne({_id: createdOrder._id}, function(err, order) {
                        assert.equal(order.status, new_order.status);

                        Delivery.find(function(err, deliveries) {
                          assert.equal(1, deliveries.length);
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
    });
  });
});
describe('/api/orders/', function() {
  describe('GET', function() {
    it('should get the orders with the ready status', function(done) {
      User.create(data.client_user, function(err, createdClient) {

        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            plates = [createdPlate._id];
            var test_item = extend(test_item, data.test_item);

            Item.create(test_item, function(err, createdItem) {
              var items = [createdItem._id];
              var test_order = extend(test_order, data.test_order);
              test_order.client = createdClient._id;
              test_order.status = config.status.READY;
              test_order.restaurant = createdRestaurant._id;
              test_order.items = items;

              Order.create(test_order, function(err, createdOrder) {

                var test_order_not_ready = {
                  status: config.status.ORDERED
                };

                Order.create(test_order_not_ready, function(err, createdOrderNotReady) {

                  login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
                    client
                    .get('/api/orders?status=3')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.body.length, 1);
                      order = res.body[0];
                      assert.equal(order.client, createdClient._id);
                      assert.equal(order.status, config.status.READY);
                      assert.equal(order.restaurant, createdRestaurant._id);
                      assert.equal(order.items.length, 1);
                      assert.equal(order.items[0], createdItem._id);
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
});
