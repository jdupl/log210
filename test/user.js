var utils = require('./utils');
var User = require('../backend/models/user');
var assert = require('assert');

describe('User model', function() {
  describe('insert', function() {
    it('should insert a user in the database', function(done) {
      User.create(utils.data, function(err, created) {
        assert.notEqual(undefined, created);
        assert.equal(utils.fake_date, created.birth_date.getTime());
        assert.equal(2, created.address.length);
        done();
      });
    });
    it('should hash the password when inserting', function(done) {
      User.create(utils.data, function(err, created) {
        created.verifyPassword(utils.data.password, function(err, isMatch) {
          assert(isMatch);
          done();
        });
      });
    });
  });
  describe('findOne', function() {
    it('should find one from username', function(done) {
      User.create(utils.data, function(err, created) {
        User.findOne({email: utils.data.email}, function(err, user) {
          assert.notEqual(undefined, user);
          assert.equal(utils.fake_date, user.birth_date.getTime());
          assert.equal(2, user.address.length);
          done();
        });
      });
    });
  });
});
