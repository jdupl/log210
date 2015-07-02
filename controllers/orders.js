var Order = require('../models/order');
var User = require('../models/user');
var Item = require('../models/item');
var config = require('../config/config');
var random = require('random-js')();

var extend = require('extend');
var async = require('async');

exports.create = function(req, res) {
  var order = req.body;
  order.client = req.user._id;
  var items = order.items;
  createItems(items, function(err) {
    createOrder(order, function(err, createdOrder) {
      updateUserAddress(createdOrder, function(err) {
        res.status(201).json(createdOrder);
      });
    });
  });
};

/*
* Cleanup the order object and create and order
* @param order
*/
function createOrder(order, callback) {
  order.status = config.status.ORDERED;
  order.confirmation_number = random.integer(1, 100);
  delete order.items;
  Order.create(order, callback);
};

/*
* Update the user's address
* depending on the order's address
* and the user's primary address
* @param order
*/
function updateUserAddress(order, callback) {
  User.findOne({_id: order.client}).select('address optional_addresses').exec(function(err, user) {
    if(user.address == order.delivery_address) {
      callback(err);
    } else {
      user.optional_addresses.push(user.address);
      user.address = order.delivery_address;
      user.save(callback);
    }
  });
}

/*
* Create the items
* @param items
*/
function createItems(items, callback) {
  async.eachSeries(items, function(item, cb) {
    Item.create(item, function(err, createdItem) {
      cb(err);
    });
  }, callback);
};

exports.update = function(req, res) {
  var order_id = req.params.id;
  Order.update({_id: order_id}, req.body, function(err, updated) {
    res.status(200).json({message: 'order updated'});
  });
};
