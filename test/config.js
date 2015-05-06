var config = require('../backend/config/config');
var assert = require('assert');

describe('Configuration', function() {
  describe('Default', function() {
    it('should contain the default configuration options', function() {
      assert.equal(config.server.port, 3000);
    });
  });
});
