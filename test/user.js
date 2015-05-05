var utils = require('./utils');
var User = require('../backend/models/user');
var assert = require('assert');

describe('User model', function() {
  describe('insert', function() {
    it('should insert a user in the database', function(done) {
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
      User.create(data, function(err, created) {
        assert.notEqual(undefined, created);
        assert.equal(fake_date, created.birth_date.getTime());
        assert.equal(2, created.address.length);
        done();
      });
    });
  });
});
