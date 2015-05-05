var app = require('../app');
var client = require('supertest');
var assert = require('assert');

describe('/api/users', function() {
  describe('POST', function() {
    it('should create a user from the json payload', function(done) {
      var data = {};
      client(app)
        .post('/api/users')
        .send(data)
        .end(function(err, res) {
          assert.equal(201, res.status);
          done();
        });
    });
  });
});
