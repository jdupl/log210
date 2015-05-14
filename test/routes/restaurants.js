var User = require('../../models/user');
var data = require('../utils/data');
var client = require('supertest');
var assert = require('assert');
var app = require('../../app');
var Restaurant = require('../../models/restaurant');

describe('/api/restaurants/', function() {
  describe('POST', function() {
    it('should create a restaurant', function(done) {
      User.create(data.contractor_user, function(err, createdContractor) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var request = client(app);
          request
            .post('/api/login')
            .send({email: data.contractor_user.email, password: data.contractor_user.password})
            .end(function(err, res) {
              var test_restaurant = {
                name: 'test-restaurant',
                restaurateur: createdRestaurateur._id
              };
              request
                .post('/api/restaurants')
                .send(test_restaurant)
                .end(function(err, res) {
                  assert.equal(res.status, 201);
                  Restaurant.findOne({_id: res.body.id}, function(err, restaurant) {
                    assert.equal(restaurant.name, 'test-restaurant');
                    assert.equal(restaurant.restaurateur.toString(), createdRestaurateur._id);
                    done();
                  });
                });
            });
        });
      });
    });
  });
});
