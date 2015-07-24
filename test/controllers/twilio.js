var mockUtils = require('../utils/mocks');
var twilioSingleModulePath = '../../controllers/twilio';
var mockery = require('mockery');

describe('twilio', function() {
  describe('sendConfirmationSMS', function() {
    it('should call the fake twilio service with status 1', function(done) {
      mockTwilioLibrary(function() {
        var twilioSingleton = require(twilioSingleModulePath);
        twilioSingleton.getInstance().sendConfirmationSMS(null, 1, function() {
          cleanupMocks(done);
        });
      });
    });
    it('should call the fake twilio service with status 2', function(done) {
      mockTwilioLibrary(function() {
        var twilioSingleton = require(twilioSingleModulePath);
        twilioSingleton.getInstance().sendConfirmationSMS(null, 2, function() {
          cleanupMocks(done);
        });
      });
    });
    it('should call the fake twilio service with status 3', function(done) {
      mockTwilioLibrary(function() {
        var twilioSingleton = require(twilioSingleModulePath);
        twilioSingleton.getInstance().sendConfirmationSMS(null, 3, function() {
          cleanupMocks(done);
        });
      });
    });
    it('should call the fake twilio service with status 4', function(done) {
      mockTwilioLibrary(function() {
        var twilioSingleton = require(twilioSingleModulePath);
        twilioSingleton.getInstance().sendConfirmationSMS(null, 4, function() {
          cleanupMocks(done);
        });
      });
    });
  });
});

function mockTwilioLibrary(callback) {
  var stubTwilioClient = {
    sms: {
      messages: {
        create: function(options, callback) {
          console.log('Fake twilio call');
          callback();
        }
      }
    }
  };
  var stubTwilioLib = (function(sid, token) {
    return stubTwilioClient;
  });
  var twilioModulePath = 'twilio';
  mockUtils.injectMock(stubTwilioLib, twilioModulePath, twilioSingleModulePath, callback);
}

function cleanupMocks(callback) {
  mockery.disable();
  mockery.deregisterAll();
  callback();
}
