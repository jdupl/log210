var Order = require('../models/order');
var User = require('../models/user');
var Delivery = require('../models/delivery');
var Item = require('../models/item');
var config = require('../config/config');
var random = require('random-js')();
var twilio = require('./twilio');

var extend = require('extend');
var async = require('async');

var orderFactory = require('./order-factory');

exports.create = function(req, res) {
  var order = req.body;
  order.client = req.user._id;
  var items = order.items;
  createItems(items, function(err) {
    createOrder(order, function(err, createdOrder) {
      updateUserAddress(createdOrder, function(err, user) {
        createHtml(createdOrder, user, function(html) {
          sendConfirmationMail(user.email, html, function(err, info) {
            twilio.getInstance().sendConfirmationSMS(user.phone, 1, function(err, info) {
              if(err) console.log(err);
                res.status(201).json(createdOrder);
            });
          });
        });
      });
    });
  });
};

function sendConfirmationMail(recipient, html, callback) {
  var mailOptions = {
    from: config.from,
    to: recipient,
    subject: 'Confirmation de la commande',
    text: 'Confirmation message',
    html: html
  }
  var transporter = config.transporter;
  transporter.sendMail(mailOptions, function(error, info) {
    callback(error, info);
  });
};

function createHtml(order, user, callback) {
  var title = '<h1>Commande ' + order.confirmation_number + "</h1>"
  var description = "<p>La commande sera livrée le " + order.delivery_date + " au "
    + order.delivery_address + ".</p>"
  var html = title.concat(description);
  callback(html);
};

/*
* Cleanup the order object and create and order
* @param order
*/
function createOrder(order, callback) {
  var order = orderFactory.getOrder(order);
  order.save(callback);
};

/*
* Update the user's address
* depending on the order's address
* and the user's primary address
* @param order
*/
function updateUserAddress(order, callback) {
  User.findOne({_id: order.client}).exec(function(err, user) {
    if(user.address == order.delivery_address) {
      callback(err, user);
    } else {
      user.optional_addresses.push(user.address);
      user.address = order.delivery_address;
      user.save(function(err) {
        callback(err, user);
      });
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

/*
* Update the status of the order
* If the request status is ready,
* also add the order to the delivery list
* @param req
* @param res
*/
exports.update = function(req, res) {
  var order_id = req.params.id;
  var status = req.body.status;
  Order.findOne({_id: order_id}, function(err, order) {
    if(order.status === req.body.status) {
      res.status(409).json({message: 'You cannot update the order to the ready status two times.'})
    } else {
      if(status === config.status.DELIVERING) {
        order.status = req.body.status;
        order.save(function(err) {
          addOrderToDeliveryList(order._id, function() {
            sendMessage(order_id, function(err, info) {
              res.status(200).json({message: 'order updated'});
            });
          });
        });
      } else {
        order.status = status;
        order.save(function(err) {
          sendMessage(order_id, function(err, info) {
            res.status(200).json({message: 'order updated'});
          });
        });
      }
    }
  });
};

exports.getAll = function(req, res) {
  var status = req.query.status;
  Order.find({status: status}, function(err, orders) {
    res.status(200).json(orders);
  });
};

function sendMessage(order_id, callback) {
  Order.findOne({_id : order_id}).populate({path: 'client', select: 'phone'}).exec(function(err, ord) {
    twilio.getInstance().sendConfirmationSMS(ord.client.phone, ord.status, callback);
  });
}
/*
* Create a devliery with the order id
* @param order id
*/
function addOrderToDeliveryList(order_id, callback) {
  var delivery = {
    order_id: order_id
  };

  Delivery.create(delivery, callback);
}
