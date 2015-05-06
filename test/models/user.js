var database = require('../utils/database');
var User = require('../../backend/models/user');
var assert = require('assert');
var data = require('../utils/data');

describe('User model', function() {
  describe('insert', function() {
    it('should insert a user in the database', function(done) {
      User.create(data.fake_user, function(err, created) {
        assert.notEqual(undefined, created);
        assert.equal(data.fake_date, created.birth_date.getTime());
        assert.equal(2, created.address.length);
        done();
      });
    });
    it('should hash the password when inserting', function(done) {
      User.create(data.fake_user, function(err, created) {
        created.verifyPassword(data.fake_user.password, function(err, isMatch) {
          assert(isMatch);
          done();
        });
      });
    });
  });
  describe('findOne', function() {
    it('should find one from username', function(done) {
      User.create(data.fake_user, function(err, created) {
        User.findOne({email: data.fake_user.email}, function(err, user) {
          assert.notEqual(undefined, user);
          assert.equal(data.fake_date, user.birth_date.getTime());
          assert.equal(2, user.address.length);
          done();
        });
      });
    });
  });
});
