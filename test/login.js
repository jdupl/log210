var app = require('../app');
var client = require('supertest');
var assert = require('assert');
var User = require('../backend/models/user');
var jwt = require('jsonwebtoken');
var fake_date = Date.now();
var secret = 'secret'; //TODO Refactor in secret config
var data = {
  email: 'test@test.com',
  password: 'test-pass',
  type: 'test-type',
  name: 'test-name',
  phone: '123-123-1234',
  address: ['test-address', 'test-address2'],
  birth_date: fake_date
}; //TODO Put in utils

describe('/api/login', function() {
  describe('POST', function() {
    it('should get the JWT token', function(done) {
      User.create(data, function(err, created) {
        client(app)
          .post('/api/login')
          .send({email: data.email, password: data.password})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            var token = res.body.token;
            jwt.verify(token, secret, function(err, decoded) {
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
          .send({email: data.email, password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
  });
});
