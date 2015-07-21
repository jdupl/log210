var config = require('../config/config');
var random = require('random-js')();
var Order = require('../models/order');

module.exports = {
  getOrder: function(payload) {
    var order = payload
    order.status = config.status.ORDERED;
    order.confirmation_number = random.integer(1, 100);
    delete order.items;
    return new Order(order);
  }
}
