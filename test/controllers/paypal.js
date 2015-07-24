var paypalControllerPath = '../../controllers/paypal';
var mockUtils = require('../utils/mocks');
describe('paypal', function() {
  describe('createPayment', function() {
    it('should call the fake paypal module to create a payment', function(done) {
      mockPaypal(function() {
        var req = {
          body: {
            items: [{price: '666', quantity: '123'}]
          }
        };
        var res = {
          send: function() {}
        };
        var paypalController = require(paypalControllerPath);
        paypalController.createPayment(req, res);
        mockUtils.cleanupMocks(done);
      });
    });
  });
});

function mockPaypal(callback) {
  var stubPaypal = {
    configure: function(config) {},
    payment: {
      create: function(payment, callback) {
        payment.links = [{method: 'REDIRECT', href:'link'}];
        payment.payer.payment_method = 'paypal';
        callback(null, payment);
      }
    }
  };
  var paypalModulePath = 'paypal-rest-sdk';
  mockUtils.injectMock(stubPaypal, paypalModulePath, paypalControllerPath, callback);
}
