var Order = require('../models/order');
var User = require('../models/user');
var config = require('../config/config');

var extend = require('extend');

exports.create = function(req, res) {
  var order = req.body;
  order.status = config.status.ORDERED;
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

exports.update = function(req, res) {
  var order_id = req.params.id;
  Order.update({_id: order_id}, req.body, function(err, updated) {
    res.status(200).json({message: 'order updated'});
  });
};
