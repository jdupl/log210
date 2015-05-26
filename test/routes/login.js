var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest');
var assert = require('assert');
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var fake_date = Date.now();
var data = require('../utils/data');
var config = require('../../config/config');

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
      User.create(data.fake_user, function(err, created) {
        client(app)
          .post('/api/login')
          .send({email: created.email, password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
  });
});
describe('/api/profile/', function() {
  describe('GET', function() {
    it("should return the logged in user's information", function(done) {
      User.create(data.fake_user, function(err, created) {
        var request = client(app);
        request
          .post('/api/login/')
          .send({email: created.email, password: data.fake_user.password})
          .end(function(err, res) {
            var token = res.body.token;
            request
              .get('/api/profile/')
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
  });
});
