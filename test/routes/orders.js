var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');
var Menu = require('../../models/menu');
var Plate = require('../../models/plate');
var Item = require('../../models/item');
var Order = require('../../models/order');

var app = require('../../app');
var client = require('supertest')(app);

var data = require('../utils/data');
var login = require('../utils/login');

var extend = require('extend');
var assert = require('assert');

describe('/api/orders', function() {
  describe('POST', function() {
    it('should create an order', function(done) {
      User.create(data.client_user, function(err, createdClient) {
        Plate.create(data.test_plate, function(err, createdPlate) {
          Restaurant.create(data.test_restaurant, function(err, createdRestaurant) {
            var test_item = extend(test_item, data.test_item);
            test_item.plate = createdPlate._id;

            Item.create(data.test_item, function(err, createdItem) {
              var test_order = extend(test_order, data.test_order);
              test_order.client = createdClient._id;
              test_order.restaurant = createdRestaurant._id;
              var items = [createdItem._id];
              test_order.items = items;

              login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {

                client
                  .post('/api/orders')
                  .set('Authorization', 'Bearer ' + token)
                  .send(test_order)
                  .end(function(err, res) {
                    assert.equal(res.status, 201);
                    var order = res.body;
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
});
