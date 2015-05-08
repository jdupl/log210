var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var User = require('../../backend/models/user');
var jwt = require('jsonwebtoken');
var fake_date = Date.now();
var data = require('../utils/data');
var config = require('../../backend/config/config');

describe('/api/login', function() {
  describe('POST', function() {
    it('should get the JWT token', function(done) {
      User.create(data.fake_user, function(err, created) {
        client(app)
          .post('/api/login')
          .send({email: data.fake_user.email, password: data.fake_user.password})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            var token = res.body.token;
            jwt.verify(token, config.jwt.secret, function(err, decoded) {
              assert.notEqual(decoded, undefined);
              assert.equal(decoded, created._id);
              done();
            });
          });
      });
    });
    it('should get a 400 because of wrong email', function(done) {
      User.create(data, function(err, created) {
        client(app)
          .post('/api/login')
          .send({email: 'wrong', password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
    it('should get a 400 because of wrong password', function(done) {
      User.create(data, function(err, created) {
        client(app)
          .post('/api/login')
          .send({email: data.fake_user.email, password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
  });
});
