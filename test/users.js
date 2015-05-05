var app = require('../app');
var client = require('supertest');
var assert = require('assert');

describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user from the json payload', function(done) {
      var fake_date = Date.now();
      var data = {
        email: 'test@test.com',
        password: 'test-pass',
        type: 'test-type',
        name: 'test-name',
        phone: '123-123-1234',
        address: ['test-address', 'test-address2'],
        birth_date: fake_date
      };
      client(app)
        .post('/api/users')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 201);
          done();
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
