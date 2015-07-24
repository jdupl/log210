var mockery = require('mockery');

exports.injectMock = function(stubModule, injectedModulePath, moduleUnderTest, callback) {
  mockery.registerAllowable(moduleUnderTest);
  mockery.registerMock(injectedModulePath, stubModule);
  mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  callback();
};
