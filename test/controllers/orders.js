var async = require('async');
var ordersControllerModule = '../../controllers/orders';
var mockery = require('mockery');

describe('orders controller', function() {
  describe('create', function() {
    it('should call fake methods when creating items, an order, updating the user address, sending the confirmation mail and sending the twilio text message', function(done) {
      prepareMocks(function() {
        var ordersController = require(ordersControllerModule);
        var body = {
          items: []
        };
        var req = {
          body: body,
          user: {
            _id: 1
          }
        };
        var res = {
          status: function() {
            return this;
          },
          json: function(){}
        };
        ordersController.create(req, res);
        mockery.disable();
        mockery.deregisterAll();
        done();
      });
    });
  });
});

function prepareMocks(callback) {
  async.series([mockItem, mockOrderFactory, mockUserModelModule, mockConfigTransporter, mockTwilioService], callback);
}

function mockConfigTransporter(callback) {
  var stubTransporter = {
    sendMail: function(options, callback) {
      console.log('Fake email call');
      callback(null, null);
    }
  };
  var stubConfig = {
    transporter: stubTransporter
  };
  var configModulePath = '../config/config';
  injectMock(stubConfig, configModulePath, ordersControllerModule, callback);
}

function mockUserModelModule(callback) {
  var mockUser = {
    _id: 1,
    address: 'address'
  };
  var mockUserModel = {
    findOne: function() {
      return this;
    },
    exec: function(callback) {
      callback(null, mockUser);
    }
  };
  var userModulePath = '../models/user';
  injectMock(mockUserModel, userModulePath, ordersControllerModule, callback);
}

function mockOrderFactory(callback) {
  var mockOrder = {
    client: 1,
    delivery_address: 'address',
    save: function(callback) {
      callback(null, this);
    }
  };
  var stubOrderFactory = {
    getOrder: function() {
      return mockOrder;
    }
  };
  var orderFactoryModulePath = './order-factory';
  injectMock(stubOrderFactory, orderFactoryModulePath, ordersControllerModule, callback);
}

function mockItem(callback) {
  var stubItem = {
    create: function(item, callback) {
      console.log('Fake Item.create call');
      callback(null, item);
    }
  };
  var itemModulePath = '../models/Item';
  injectMock(stubItem, itemModulePath, ordersControllerModule, callback);
}

function injectMock(stubModule, injectedModulePath, moduleUnderTest, callback) {
  mockery.registerAllowable(moduleUnderTest);
  mockery.registerMock(injectedModulePath, stubModule);
  mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  callback();
}

function cleanupMocks(callback) {
  mockery.disable();
  mockery.deregisterAll();
  callback();
}

function mockTwilioService(callback) {
  var stubTwilioService = {
    getInstance: function() {
      var twilio = {
        sendConfirmationSMS: function(number, msg, callback) {
          console.log('Fake twillio call');
          callback();
        }
      };
      return twilio;
    }
  };

  var twilioModulePath = './twilio';

  injectMock(stubTwilioService, twilioModulePath, ordersControllerModule, callback);
}
