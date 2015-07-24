var async = require('async');
var ordersControllerModule = '../../controllers/orders';
var mockery = require('mockery');
var config = require('../../config/config');

describe('orders controller', function() {
  describe('create', function() {
    it('should call fake methods when creating items, an order, updating the user address, sending the confirmation mail and sending the twilio text message', function(done) {
      async.series([mockItem,
        mockOrderFactory,
        mockUserModelModule,
        mockConfigTransporter,
        mockTwilioService],
        function() {
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
  describe('update', function() {
    it('should update the order, add it to the delivery and call the fake twilio method', function(done) {
      async.series([mockOrderModel, mockDeliveryModel, mockTwilioService], function(err) {
        var body = {
          status: config.status.DELIVERING
        };
        var req = {
          body: body,
          params: {
            id: 1
          }
        };
        var res = {
          status: function() {
            return this;
          },
          json: function(){}
        };
        var ordersController = require(ordersControllerModule);
        ordersController.update(req, res);
        mockery.disable();
        mockery.deregisterAll();
        done();
      });
    });
  });
  it('should update the order but not add it to the delivery list. Call the fake twilio serivce', function(done) {
    async.series([mockOrderModel, mockTwilioService], function(err) {
      var body = {
        status: config.status.PREPARING
      };
      var req = {
        body: body,
        params: {
          id: 1
        }
      };
      var res = {
        status: function() {
          return this;
        },
        json: function(){}
      };
      var ordersController = require(ordersControllerModule);
      ordersController.update(req, res);
      mockery.disable();
      mockery.deregisterAll();
      done();
    });
  });
});

function mockDeliveryModel(callback) {
  var stubDeliveryModel = {
    create: function(delivery, callback) {
      callback(null, null);
    }
  };
  var deliveryModulePath = '../models/delivery';
  injectMock(stubDeliveryModel, deliveryModulePath, ordersControllerModule, callback);
}

function mockOrderModel(callback) {
  var stubOrder = {
    status: config.status.READY,
    client: 1,
    save: function(callback) {
      callback();
    }
  };
  var stubOrderModel = {
    findOne: function(data, callback) {
      if(typeof(callback) == "function") {
        callback(null, stubOrder);
      } else {
        return this;
      }
    },
    populate: function() {
      return this;
    },
    exec: function(callback) {
      callback(null, stubOrder);
    }
  };
  var orderModulePath = '../models/order';
  injectMock(stubOrderModel, orderModulePath, ordersControllerModule, callback);
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
          var error = new Error('Fake error');
          callback(error);
        }
      };
      return twilio;
    }
  };

  var twilioModulePath = './twilio';

  injectMock(stubTwilioService, twilioModulePath, ordersControllerModule, callback);
}
