var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');
var Menu = require('../../models/menu');
var Plate = require('../../models/plate');

var app = require('../../app');
var client = require('supertest')(app);

var data = require('../utils/data');
var login = require('../utils/login');

var extend = require('extend');
var assert = require('assert');


describe('/api/restaurants/', function() {
  describe('POST', function() {
    it('should create a restaurant', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
            var test_restaurant = {
              name: 'test-restaurant',
              restaurateur: createdRestaurateur._id
            };
            client
              .post('/api/restaurants')
              .set('Authorization', 'Bearer ' + token)
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
          login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
            var test_restaurant = {
              name: 'test-restaurant',
              restaurateur: createdRestaurateur._id
            };

            client
              .post('/api/restaurants')
              .set('Authorization', 'Bearer ' + token)
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
          login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
            var test_restaurant = {
              name: 'test-restaurant'
            };
            client
              .post('/api/restaurants')
              .set('Authorization', 'Bearer ' + token)
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
          login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
            client
              .post('/api/restaurants')
              .set('Authorization', 'Bearer ' + token)
              .send(test_restaurant)
              .end(function(err, res) {
                assert.equal(res.status, 201);
                client
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
            login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
              client
                .delete('/api/restaurants/' + createdRestaurant._id)
                .set('Authorization', 'Bearer ' + token)
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

          var restaurateur_user_2 = extend(restaurateur_user_2, data.restaurateur_user);
          restaurateur_user_2.email = 'restaurateur2@test.com';

          User.create(restaurateur_user_2, function(err, createdRestaurateur2) {

            var test_restaurant = {
              name: 'test-restaurant',
              restaurateur: createdRestaurateur._id
            };
            var updated_restaurant = {
              name: 'updated-restaurant',
              restaurateur: createdRestaurateur2._id
            };

            login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
              client
                .post('/api/restaurants')
                .set('Authorization', 'Bearer ' + token)
                .send(test_restaurant)
                .end(function(err, res) {
                  assert.equal(res.status, 201);
                  var restaurant_id = res.body.id;

                  client
                    .put('/api/restaurants/' + res.body.id)
                    .send(updated_restaurant)
                    .set('Authorization', 'Bearer ' + token)
                    .end(function(err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.body.message, 'The restaurant is updated');

                      User.findOne({_id: createdRestaurateur}, function(err, user1) {
                        assert.equal(user1.restaurants.length, 0);

                        User.findOne({_id: createdRestaurateur2}, function(err, user2) {
                          assert.equal(restaurant_id, user2.restaurants[0]);
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
    it('should not modify the informations of the restaurant if the user is not a admin', function(done) {
      User.create(data.client_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          var test_restaurant = {
            name: 'test-restaurant',
            restaurateur: createdRestaurateur._id
          };
          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var updated_restaurant = {
              name: 'updated-restaurant',
              restaurateur: '7'
            };
            login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
              client
                .put('/api/restaurants/' + createdRestaurant._id)
                .send(updated_restaurant)
                .set('Authorization', 'Bearer ' + token)
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
    it('should update the restaurant with a new restaurateur', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        User.create(data.restaurateur_user, function(err, createdRestaurateur) {
          Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
            login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
              var updated_restaurant = {
                name: 'updated-restaurant',
                restaurateur: createdRestaurateur._id
              };
              client
                .put('/api/restaurants/' + createdRestaurant._id)
                .set('Authorization', 'Bearer ' + token)
                .send(updated_restaurant)
                .end(function(err, res) {
                  assert.equal(res.status, 200);
                  User.findOne({_id: createdRestaurateur._id}, function(err, restaurateur) {
                    assert.equal(restaurateur.restaurants.length, 1);
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
describe('/api/restaurants', function() {
  describe('GET', function() {
    it('should return all the restaurants', function(done) {
      Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
        client
        .get('/api/restaurants/')
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
describe('/api/restaurants/:id', function() {
  describe('GET', function() {
    it('should get the restaurant', function(done) {
      User.create(data.admin_user, function(err, createdAdmin) {
        Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
          login.getToken(data.admin_user.email, data.admin_user.password, client, function(err, token) {
            client
            .get('/api/restaurants/' + createdRestaurant._id)
            .set('Authorization', 'Bearer ' + token)
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
describe('/api/restaurants/:id/users', function() {
  describe('GET', function() {
    it('should get the restaurateur associated with the restaurant', function(done) {
      Restaurant.create({name: 'test-restaurant'}, function(err, createdRestaurant) {
        var restaurateur = extend(restaurateur, data.restaurateur_user);
        restaurateur.restaurants.push(createdRestaurant._id);
        User.create(restaurateur, function(err, createdRestaurateur) {
          client
            .get('/api/restaurants/' + createdRestaurant._id + '/users')
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, createdRestaurateur._id);
              done();
            });
        });
      });
    });
  });
});
describe('/api/restaurants/:id/menus', function() {
  describe('GET', function() {
    it('should get all the menus related to that restaurant', function(done) {
      Plate.create(data.test_plate, function(err, createdPlate) {
        var test_menu = extend(test_menu, data.test_menu);
        var plates = [createdPlate._id];
        test_menu.plates = plates;

        Menu.create(test_menu, function(err, createdMenu) {
          var test_restaurant = extend(test_restaurant, data.test_restaurant);
          var menus = [createdMenu._id];
          test_restaurant.menus = menus;

          Restaurant.create(test_restaurant, function(err, createdRestaurant) {
            var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
            var restaurants = [createdRestaurant._id];
            test_restaurateur.restaurants = restaurants;

            User.create(test_restaurateur, function(err, createdRestaurateur) {
              login.getToken(test_restaurateur.email, test_restaurateur.password, client, function(err, token) {
                client
                  .get('/api/restaurants/' + createdRestaurant._id + '/menus')
                  .set('Authorization', 'Bearer ' + token)
                  .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 1);
                    assert.equal(res.body[0]._id, createdMenu._id);
                    assert.equal(res.body[0].plates[0]._id, createdPlate._id);
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
