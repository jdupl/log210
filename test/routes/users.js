var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var data = require('../utils/data');
var User = require('../../models/user');


describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user of type client from the json payload', function(done) {
      client(app)
        .post('/api/users')
        .send(data.client_user)
        .end(function(err, res) {
          assert.equal(res.status, 201);
          User.findOne({email: 'test@test.com'}, function(err, user) {
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
    it('should get informations about the user', function(done) {
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
                assert.equal(res.status, 200);
                assert.equal(res.body.email, data.fake_user.email);
                assert.equal(res.body.type, data.fake_user.type);
                assert.equal(res.body.name, data.fake_user.name);
                assert.equal(res.body.phone, data.fake_user.phone);
                assert.equal(res.body.password, undefined);
                assert.equal(new Date(res.body.birth_date).getTime(), new Date(data.fake_user.birth_date).getTime());
                assert.equal(res.body.address.length, 2);
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
          address: ['new-address1', 'new-address2', 'new-address3']
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
                  assert.equal(user.address.length, 3);
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
