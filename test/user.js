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
    it('should hash the password when inserting', function(done) {
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
        created.verifyPassword(data.password, function(err, isMatch) {
          assert(isMatch);
          done();
        });
      });
    });
  });
  describe('findOne', function() {
    it('should find one from username', function(done) {
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
        User.findOne({email: data.email}, function(err, user) {
          assert.notEqual(undefined, user);
          assert.equal(fake_date, user.birth_date.getTime());
          assert.equal(2, user.address.length);
          done();
        });
      });
    });
  });
});
