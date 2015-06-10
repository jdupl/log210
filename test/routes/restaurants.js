var User = require('../../models/user');
var data = require('../utils/data');
var client = require('supertest');
var assert = require('assert');
var app = require('../../app');
var Restaurant = require('../../models/restaurant');

describe('/api/restaurants/', function() {
  describe('POST', function() {
    it('should create a restaurant', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var request = client(app);
          request
            .post('/api/login')
            .send({email: data.admin_user.email, password: data.admin_user.password})
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
                    User.findOne({_id: createdRestaurateur._id}, function(err, restaurateur) {
                      assert.equal(1, restaurateur.restaurants.length);
                      assert.equal(res.body.id, restaurateur.restaurants[0]);
                      done();
                    });
                  });
                });
            });
        });
      });
    });
    it('should not be able to create a restaurateur if the user is not logged as a admin', function(done) {
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
                  assert.equal(res.body.message, 'You cannot create a restaurant, you are not a admin');
                  done();
                });
            });
        });
      });
    });
    it('should create a restaurant with no restaurateur and notify the user', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var request = client(app);
          request
          .post('/api/login')
          .send({email: data.admin_user.email, password: data.admin_user.password})
          .end(function(err, res) {
            var test_restaurant = {
              name: 'test-restaurant'
            };
            request
            .post('/api/restaurants')
            .set('Authorization', 'Bearer ' + res.body.token)
            .send(test_restaurant)
            .end(function(err, res) {
              assert.equal(res.status, 201);
              assert.equal(res.body.message, 'Restaurant created with no restaurateur.');
              Restaurant.findOne({_id: res.body.id}, function(err, restaurant) {
                assert.equal(restaurant.name, 'test-restaurant');
                done();
              });
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
      User.create(data.admin_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          var request = client(app);
          request
            .post('/api/login')
            .send({email: data.admin_user.email, password: data.admin_user.password})
            .end(function(err, res) {
              var token = res.body.token;
              request
                .post('/api/restaurants')
                .set('Authorization', 'Bearer ' + token)
                .send(test_restaurant)
                .end(function(err, res) {
                  assert.equal(res.status, 201);
                  request
                    .delete('/api/restaurants/' + res.body.id)
                    .set('Authorization', 'Bearer ' + token)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);
                      User.findOne({_id: createdRestaurateur._id}, function(err, restaurateur) {
                        assert.equal(0, restaurateur.restaurants.length);
                        done();
                      });
                    });
                });
            });
        });
      });
    });
    it('should not delete a restaurant if the user is not a admin', function(done) {
      User.create(data.client_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var request = client(app);
            //TODO Create a login method in the utils
            request
              .post('/api/login')
              .send({email: data.client_user.email, password: data.client_user.password})
              .end(function(err, res) {
                request
                  .delete('/api/restaurants/' + createdRestaurant._id)
                  .set('Authorization', 'Bearer ' + res.body.token)
                  .end(function(err, res) {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.message, 'You cannot create a restaurant, you are not a admin');
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
      User.create(data.admin_user, function(err, createdAdmin) {
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
            .send({email: data.admin_user.email, password: data.admin_user.password})
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
    it('should not modify the informations of the restaurant if the user is not a admin', function(done) {
      User.create(data.client_user, function(err, createdAdmin) {
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
            .send({email: data.client_user.email, password: data.client_user.password})
            .end(function(err, res) {
              request
              .put('/api/restaurants/' + createdRestaurant._id)
              .send(updated_restaurant)
              .set('Authorization', 'Bearer ' + res.body.token)
              .end(function(err, res) {
                assert.equal(res.status, 401);
                assert.equal(res.body.message, 'You cannot modify a restaurant, you are not a admin');
                done();
              });
            });
          });
        });
      });
    });
  });
});
describe('/api/restaurants', function() {
  describe('GET', function() {
    it('should return all the restaurants', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
          var request = client(app);
          request
          .post('/api/login')
          .send({email: data.admin_user.email, password: data.admin_user.password})
          .end(function(err, res) {
            request
            .get('/api/restaurants/')
            .set('Authorization', 'Bearer ' + res.body.token)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 1);
              assert.equal(res.body[0].name, 'test-restaurant');
              done();
            });
          });
        });
      });
    });
    it('should get a 401 if the loggged user is not an admin', function(done) {
      User.create(data.client_user, function(err, createdClient) {
        Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
          var request = client(app);
          request
          .post('/api/login')
          .send({email: data.client_user.email, password: data.client_user.password})
          .end(function(err, res) {
            request
            .get('/api/restaurants/')
            .set('Authorization', 'Bearer ' + res.body.token)
            .end(function(err, res) {
              assert.equal(res.status, 401);
              assert.equal(res.body.message, 'Unauthorized. You are not an admin user');
              done();
            });
          });
        });
      });
    });
  });
});
describe('/api/restaurants/:id', function() {
  describe('GET', function() {
    it('should get the restaurant', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
          var request = client(app);
          request
          .post('/api/login')
          .send({email: data.admin_user.email, password: data.admin_user.password})
          .end(function(err, res) {
            request
            .get('/api/restaurants/' + createdRestaurant._id)
            .set('Authorization', 'Bearer ' + res.body.token)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.name, 'test-restaurant');
              done();
            });
          });
        });
      });
    });
  });
});
