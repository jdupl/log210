var database = require('../utils/database');
var User = require('../../models/user');
var assert = require('assert');
var data = require('../utils/data');
var mockery = require('mockery');
var sinon = require('sinon');

describe('User model', function() {
  describe('insert', function() {
    it('should hash the password when inserting', function(done) {
      User.create(data.client_user, function(err, created) {
        created.verifyPassword(data.client_user.password, function(err, isMatch) {
          assert(isMatch);
          done();
        });
      });
    });
    it('should mock the bcrypt genSalt method to return an error in the next callback', function(done) {
      var fakeBcrypt = {
        genSalt: function() {},
        hash: function() {}
      };
      var mockBcrypt = sinon.mock(fakeBcrypt);
      var fakeError = new Error('fake');
      var fakeSalt = 'salt';
      var fakePassword = 'password';
      var fakeHash = 'hash';
      var genSaltExpectation = mockBcrypt
        .expects("genSalt").once().withArgs(10).callsArgWith(1, fakeError, fakeSalt);
      var userModulePath = '../../models/user';
      mockery.registerAllowable(userModulePath);
      mockery.registerMock('bcrypt', fakeBcrypt);
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
      var modifiedUser = require(userModulePath);
      modifiedUser.create(data.client_user, function(err, created) {
        assert.equal(fakeError, err);
        mockBcrypt.verify();
        mockery.disable();
        mockery.deregisterAll();
        done();
      });
    });
    it('should mock the bcrypt hash method to return an error in the next callback', function(done) {
      var fakeBcrypt = {
        genSalt: function() {},
        hash: function() {}
      };
      var mockBcrypt = sinon.mock(fakeBcrypt);
      var fakeError = new Error('fake');
      var fakeSalt = 'salt';
      var fakeHash = 'hash';
      var genSaltExpectation = mockBcrypt
        .expects("genSalt").once().withArgs(10).callsArgWith(1, undefined, fakeSalt);
      var hashExpectation = mockBcrypt
        .expects("hash").once().withArgs(data.client_user.password, fakeSalt).callsArgWith(2, fakeError, fakeHash);
      var userModulePath = '../../models/user';
      mockery.registerAllowable(userModulePath);
      mockery.registerMock('bcrypt', fakeBcrypt);
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
      var modifiedUser = require(userModulePath);
      modifiedUser.create(data.client_user, function(err, created) {
        assert.equal(fakeError, err);
        mockBcrypt.verify();
        mockery.disable();
        mockery.deregisterAll();
        done();
      });
    });
  });
  describe('update', function() {
    it('should update the password with a new hash', function(done) {
      User.create(data.client_user, function(err, createdUser) {
        var new_password = 'new_password';
        createdUser.password = new_password;
        createdUser.save(function(err, updatedUser) {
          updatedUser.verifyPassword(new_password, function(err, isMatch) {
            assert(isMatch);
            done();
          });
        });
      });
    });
  });
});
