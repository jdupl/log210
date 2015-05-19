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
                .set('Authorization', 'Bearer ' + res.body.token)
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
    it('should not be able to create a restaurateur if the user is not logged as a contractor', function(done) {
      User.create(data.client_user, function(err, createdClient) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var request = client(app);
          request
            .post('/api/login')
            .send({email: data.client_user.email, password: data.client_user.password})
            .end(function(err, res) {
              var test_restaurant = {
                name: 'test-restaurant',
                restaurateur: createdRestaurateur._id
              };
              request
                .post('/api/restaurants')
                .set('Authorization', 'Bearer ' + res.body.token)
                .send(test_restaurant)
                .end(function(err, res) {
                  assert.equal(res.status, 401);
                  assert.equal(res.body.message, 'You cannot create a restaurant, you are not a contractor');
                  done();
                });
            });
        });
      });
    });
  });
});
describe('/api/restaurants/:id', function() {
  describe('DELETE', function() {
    it('should delete a restaurant', function(done) {
      User.create(data.contractor_user, function(err, createdContractor) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var request = client(app);
            request
              .post('/api/login')
              .send({email: data.contractor_user.email, password: data.contractor_user.password})
              .end(function(err, res) {
                request
                .delete('/api/restaurants/' + createdRestaurant._id)
                .set('Authorization', 'Bearer ' + res.body.token)
                .end(function(err, res) {
                  assert.equal(res.status, 200);
                  done();
                });
              });
          });
        });
      });
    });
    it('should not delete a restaurant if the user is not a contractor', function(done) {
      User.create(data.client_user, function(err, createdContractor) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var request = client(app);
            request
              .post('/api/login')
              .send({email: data.client_user.email, password: data.client_user.password})
              .end(function(err, res) {
                request
                  .delete('/api/restaurants/' + createdRestaurant._id)
                  .set('Authorization', 'Bearer ' + res.body.token)
                  .end(function(err, res) {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.message, 'You cannot create a restaurant, you are not a contractor');
                    done();
                  });
              });
          });
        });
      });
    });
  });
  describe('PUT', function() {
    it('should modify the informations of the restaurant', function(done) {
      User.create(data.contractor_user, function(err, createdContractor) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var request = client(app);
            var updated_restaurant = {
              name: 'updated-restaurant',
              restaurateur: '7'
            };
            request
            .post('/api/login')
            .send({email: data.contractor_user.email, password: data.contractor_user.password})
            .end(function(err, res) {
              request
              .put('/api/restaurants/' + createdRestaurant._id)
              .send(updated_restaurant)
              .set('Authorization', 'Bearer ' + res.body.token)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'The restaurant is updated');
                done();
              });
            });
          });
        });
      });
    });
  });
});
