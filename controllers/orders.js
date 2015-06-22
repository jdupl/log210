var Order = require('../models/order');
var User = require('../models/user');

var extend = require('extend');

exports.create = function(req, res) {
  var order = req.body;

  Order.create(order, function(err, createdOrder) {

    User.findOne({_id: order.client}).select('address optional_addresses').exec(function(err, user) {
      if(user.address == order.delivery_address) {
        res.status(201).json(createdOrder);
      } else {
        user.optional_addresses.push(user.address);
        user.address = order.delivery_address;
        user.save(function(err) {
          res.status(201).json(createdOrder);
        });
      }
    });
  });
};
