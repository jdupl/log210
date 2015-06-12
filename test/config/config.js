var assert = require('assert');
var config = require('../../config/config');
var mockery = require('mockery');

describe('Configuration', function() {
  describe('Default', function() {
    it('should contain the default configuration options', function() {
      assert.equal(config.server.port, 3000);
      assert.equal(config.types.ADMIN, 'admin');
      assert.equal(config.types.CLIENT, 'client');
      assert.equal(config.types.ANONYMOUS, 'anonymous');
      assert.equal(config.types.RESTAURATEUR, 'restaurateur');
    });
    it('should load the default config if the env is not specified', function() {
      process.env.NODE_ENV = '';
      var moduleUnderTest = '../../config/config';
      mockery.registerAllowable(moduleUnderTest);
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
      var reloadConfig = require(moduleUnderTest);
      assert.equal(reloadConfig.db.url, 'mongodb://localhost/dev');
      mockery.disable();
      mockery.deregisterAll();
    });
  });
  describe('Test', function() {
    it('should contain the test configuration options', function() {
      assert.equal(config.db.url, 'mongodb://localhost/test');
    });
  });
  describe('Private', function() {
    it('should contain the private config options', function(){
      assert.equal(config.jwt.secret, 'test');
    });
  });
});
