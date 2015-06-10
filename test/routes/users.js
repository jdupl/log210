var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var data = require('../utils/data');
var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');
var extend = require('extend');


describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user of type client from the json payload', function(done) {
      client(app)
        .post('/api/users')
        .send(data.client_user)
        .end(function(err, res) {
          assert.equal(res.status, 201);
          done();
        });
    });
    it('should return 400 Bad Request if empty payload', function(done) {
      var data = {};
      client(app)
        .post('/api/users')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });
    it('should return 400 Bad request if empty name', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.name = '';
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        var message = JSON.parse(res.error.text);
        assert.equal(message.details[0].path, 'name');
        done();
      });
    });
    it('should return 400 Bad request if bad email', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.email = 'bad email';
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        var message = JSON.parse(res.error.text);
        assert.equal(message.details[0].path, 'email');
        done();
      });
    });
    it('should return 400 Bad request if empty password', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.password = '';
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        var message = JSON.parse(res.error.text);
        assert.equal(message.details[0].path, 'password');
        done();
      });
    });
    it('should set type to client if empty type', function(done) {
      var payload = extend(true, payload, data.client_user);
      delete payload.type;
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 201);
        User.findOne(res.body.user._id, function(err, user) {
          assert.equal(user.type, 'client');
          done();
        });
      });
    });
    it('should return 201 even if empty date', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.birth_date = '';
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 201);
        done();
      });
    });
    it('should return 201 if empty address', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.address = [];
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 201);
        done();
      });
    });
    it('should return 201 even if bad phone number', function(done) {
      var payload = extend(true, payload, data.client_user);
      payload.phone = '123-------';
      client(app)
      .post('/api/users')
      .send(payload)
      .end(function(err, res) {
        assert.equal(res.status, 201);
        done();
      });
    });
    it('should return a 401 if the user is anonymous and tries to create an account with a type other than client', function(done) {
      client(app)
        .post('/api/users')
        .send(data.fake_user)
        .end(function(err, res) {
          assert.equal(res.status, 401);
          assert.equal(res.body.message, 'You cannot create a user of type test-type, you are a visitor');
          done();
        });
    });
    it('should insert a restaurateur', function(done) {
      var test_restaurant = {
        name: 'test-restaurant',
      };
      Restaurant.create(test_restaurant, function(err, createdRestaurant) {
        User.create(data.admin_user, function(err, createdAdmin) {
          var request = client(app);
          var payload = extend(payload, data.restaurateur_user);
          payload.restaurants = [createdRestaurant._id];
          request
          .post('/api/login')
          .send({email: createdAdmin.email, password: data.admin_user.password})
          .end(function(err, res) {
            var token = res.body.token;
            request
            .post('/api/users/')
            .set('Authorization', 'Bearer ' + token)
            .send(payload)
            .end(function(err, res) {
              assert.equal(201, res.status);
              User.findOne({_id: res.body.user})
                .exec(function(err, user) {
                  Restaurant.findOne({_id: user.restaurants[0]}, function(err, rest1) {
                    assert.equal(test_restaurant.name, rest1.name);
                    done();
                  });
                });
            });
          });
        });
      });
    });
  });
  describe('GET', function() {
    it('should return a 401 if the user is not admin', function(done) {
      User.create(data.fake_user, function(err, created) {
        var request = client(app);
        request
          .post('/api/login')
          .send({email: created.email, password: data.fake_user.password})
          .end(function(err, res) {
            var token = res.body.token;
            request
              .get('/api/users/')
              .set('Authorization', 'Bearer ' + token)
              .end(function(err, res) {
                assert.equal(res.status, 401);
                assert.equal(JSON.parse(res.error.text).message, 'Only the administrator can list the users');
                done();
              });
          });
      });
    });
    it('should return a 401 if the token is invalid', function(done) {
      User.create(data.fake_user, function(err, created) {
        var request = client(app);
        request
          .post('/api/login')
          .send({email: created.email, password: data.fake_user.password})
          .end(function(err, res) {
            var token = res.body.token;
            User.remove({_id: created._id}, function(err, removed) {
              request
                .get('/api/users/')
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                  assert.equal(res.status, 401);
                  done();
                });
            });
          });
      });
    });
    it('should return all the users if the user is logged in as admin', function(done) {
      User.create(data.fake_user, function(err, createdUser) {
        User.create(data.admin_user, function(err, createdAdmin) {
          var request = client(app);
          request.post('/api/login')
            .send({email: createdAdmin.email, password: data.admin_user.password})
            .end(function(err, res) {
              request
                .get('/api/users/')
                .set('Authorization', 'Bearer ' + res.body.token)
                .end(function(err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.body.length, 2);
                  done();
                });
            });
        });
      });
    });
    it('should return all the users with the restaurateur type', function(done) {
      User.create(data.fake_user, function(err, createdUser) {
        User.create(data.admin_user, function(err, createdAdmin) {
          User.create(data.restaurateur_user, function(err, createdRestaurateur) {
            var request = client(app);
            request.post('/api/login')
              .send({email: createdAdmin.email, password: data.admin_user.password})
              .end(function(err, res) {
                request
                  .get('/api/users?type=restaurateur')
                  .set('Authorization', 'Bearer ' + res.body.token)
                  .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 1);
                    assert.equal(res.body[0].type, 'restaurateur');
                    done();
                  });
              });
          });
        });
      });
    });
  });
});
describe('/api/users/:id', function() {
  describe('PUT', function() {
    it('should modify the user', function(done) {
      User.create(data.fake_user, function(err, created) {
        var updatedDate = Date.now();
        var updated = {
          email: 'new@test.com',
          type: 'new-type',
          name: 'new-name',
          phone: '123-123-1234',
          password: 'new-password',
          birth_date: updatedDate,
          address: 'new-address'
        };
        request = client(app);
        request
          .post('/api/login')
          .send({email: created.email, password: data.fake_user.password})
          .end(function(err, res) {
            token = res.body.token;
            request
              .put('/api/users/' + created._id)
              .set('Authorization', 'Bearer ' + token)
              .send(updated)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                User.findOne({_id: created._id}, function(err, user) {
                  assert.equal(user.email, updated.email);
                  assert.equal(user.type, updated.type);
                  assert.equal(user.name, updated.name);
                  assert.equal(user.phone, updated.phone);
                  assert.equal(user.password, updated.password);
                  assert.equal(new Date(user.birth_date).getTime(), new Date(updated.birth_date).getTime());
                  assert.equal(user.address, 'new-address');
                  done();
                });
              });
          });
      });
    });
    it('should return 401 if you try to modify the informations of another user', function(done) {
      User.create(data.fake_user, function(err, created) {
        var updatedDate = Date.now();
        var updated = {
          email: 'new@test.com',
          type: 'new-type',
          name: 'new-name',
          phone: '123-123-1234',
          password: 'new-password',
          birth_date: updatedDate,
          address: 'new-address'
        };
        request = client(app);
        request
          .post('/api/login')
          .send({email: created.email, password: data.fake_user.password})
          .end(function(err, res) {
            token = res.body.token;
            request
              .put('/api/users/1')
              .set('Authorization', 'Bearer ' + token)
              .send(updated)
              .end(function(err, res) {
                assert.equal(res.status, 401);
                done();
              });
          });
      });
    });
    it('should remove the unknown fields in the payload', function(done) {
      User.create(data.client_user, function(err, created) {
        var updatedDate = Date.now();
        var updated = {
          _id: 'unknown',
          email: 'new@test.com',
          type: 'new-type',
          name: 'new-name',
          phone: '123-123-1234',
          password: 'new-password',
          birth_date: updatedDate,
          address: 'new-address'
        };
        request = client(app);
        request
          .post('/api/login')
          .send({email: created.email, password: data.client_user.password})
          .end(function(err, res) {
            token = res.body.token;
            request
              .put('/api/users/' + created._id)
              .set('Authorization', 'Bearer ' + token)
              .send(updated)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                User.findOne({_id: created._id}, function(err, user) {
                  assert.equal(user.email, updated.email);
                  assert.equal(user.type, updated.type);
                  assert.equal(user.name, updated.name);
                  assert.equal(user.phone, updated.phone);
                  assert.equal(user.password, updated.password);
                  assert.equal(new Date(user.birth_date).getTime(), new Date(updated.birth_date).getTime());
                  assert.equal(user.address, updated.address);
                  done();
                });
              });
          });
      });
    });
  });
});
describe('/api/users/:id/restaurants', function() {
  describe('GET', function(done) {
    it('should return the restaurants corresponding to the owner of this restaurant', function(done) {
      var test_restaurant = {
        name: 'test-restaurant',
      };
      Restaurant.create(test_restaurant, function(err, createdRestaurant) {
        var data_user = extend(data_user, data.restaurateur_user);
        data_user.restaurants = [createdRestaurant._id];
        User.create(data_user, function(err, createdRestaurateur) {

          var request = client(app);
          request
          .post('/api/login')
          .send({email: createdRestaurateur.email, password: data.restaurateur_user.password})
          .end(function(err, res) {
            var token = res.body.token;
            request
            .get('/api/users/' + createdRestaurateur._id + '/restaurants')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(test_restaurant.name, res.body[0].name);
              done();
            });
          });
        });
      });
    });
  });
});
