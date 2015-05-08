var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var data = require('../utils/data');
var User = require('../../backend/models/user');


describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user from the json payload', function(done) {
      client(app)
        .post('/api/users')
        .send(data.fake_user)
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
  });
});
describe('/api/users/id', function() {
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
              .get('/api/users/' + created._id)
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
                .get('/api/users/' + created._id)
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                  assert.equal(res.status, 401);
                  done();
                });
            });
          });
      });
    });
  });
});
