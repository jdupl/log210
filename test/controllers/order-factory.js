var orderFactory = require('../../controllers/order-factory');

describe('order-factory', function() {
  describe('getOrder', function() {
    it('should return an order', function(done) {
      var data = {
        items: []
      };
      var createdOrder = orderFactory.getOrder(data);
      done();
    });
  });
});
