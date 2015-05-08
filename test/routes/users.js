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
        client(app)
          .get('/api/users/' + created._id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(created.email, res.body.email);
            assert.equal(created.type, res.body.type);
            assert.equal(created.name, res.body.name);
            assert.equal(created.phone, res.body.phone);
            assert.equal(new Date(created.birth_date).getTime(), new Date(res.body.birth_date).getTime());
            assert.equal(created.address.length, res.body.address.length);
            done();
          });
      });
    });
    it('should return 404 if no user is found', function(done) {
      client(app)
        .get('/api/users/1')
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.body.message, 'user not found');
          done();
        });
    });
  });
});
