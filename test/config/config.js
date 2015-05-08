var config = require('../../backend/config/config');
var assert = require('assert');

describe('Configuration', function() {
  describe('Default', function() {
    it('should contain the default configuration options', function() {
      assert.equal(config.server.port, 3000);
    });
  });
  describe('Test', function() {
    it('should contain the test configuration options', function() {
      assert.equal(config.db.url, 'tingodb://test');
    });
  });
  describe('Private', function() {
    it('should contain the private config options', function(){
      assert.equal(config.jwt.secret, 'test');
    });
  });
});
