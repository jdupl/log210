var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var data = require('../utils/data');
var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');


describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user of type client from the json payload', function(done) {
      client(app)
        .post('/api/users')
        .send(data.client_user)
        .end(function(err, res) {
          assert.equal(res.status, 201);
          User.findOne({email: 'client@test.com'}, function(err, user) {
            assert.equal(user._id, res.body.user._id);
            done();
          });
        });
    });
    it('should return 400 Bad Request if bad payload', function(done) {
      var data = {};
      client(app)
        .post('/api/users')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 400);
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
          phone: 'new-phone',
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
          phone: 'new-phone',
          password: 'new-password',
          birth_date: updatedDate,
          address: ['new-address1', 'new-address2', 'new-address3']
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
  });
});
describe('/api/users/:id/restaurants', function() {
  describe('GET', function(done) {
    it('should return the restaurants corresponding to the owner of this restaurant', function(done) {
      User.create(data.restaurateur_user, function(err, createdRestaurateur) {
        var test_restaurant = {
          name: 'test-restaurant',
          restaurateur: createdRestaurateur._id
        };
        Restaurant.create(test_restaurant, function(err, createdRestaurant) {
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
                  done();
                });
            });
        });
      });
    });
  });
});
