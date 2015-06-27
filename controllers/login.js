var User = require('../models/user');
var Order = require('../models/order');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var async = require('async');

exports.getToken = function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          var token = jwt.sign(user._id, config.jwt.secret);
          res.status(200).json({token: token});
        } else {
          res.status(400).json({message: 'invalid password'});
        }
      });
    } else {
      res.status(400).json({message: 'user not found'});
    }
  });
};

exports.getProfile = function(req, res) {
  res.status(200).json(req.user);
};

exports.getAddresses = function(req, res) {
  var addresses = [];
  addresses[0] = req.user.address;
  addresses.push.apply(addresses, req.user.optional_addresses);
  res.status(200).json(addresses);
};

exports.getOrders = function(req, res) {
  if (req.user.type === config.types.CLIENT) {
    var client_id = req.user._id;
    Order.find({client: client_id}, function(err, orders) {
      res.status(200).json(orders);
    });
  } else if (req.user.type === config.types.RESTAURATEUR) {
    //Get the restaurants from the logged in user
    var restaurants = req.user.restaurants;
    getOrdersFromRestaurants(restaurants, function(err, response) {
      res.status(200).json(response);
    });
  }
};

/**
* Get all the orders from the restaurants
* @param {[Restaurant]} restaurants
*/
function getOrdersFromRestaurants(restaurants, cbErr) {
  var response = [];
  async.eachSeries(restaurants, function(restaurant, cb) {
    Order.find({restaurant: restaurant}, function(err, orders) {
      addOrdersToResponse(response, orders, cb);
    });
  }, function(err) {
    cbErr(err, response);
  });
}

/**
* Adds all the orders to the response object
* @param {[Order]} response
* @param {[Order]} orders
*/
function addOrdersToResponse(response, orders, cbErr) {
  async.eachSeries(orders, function(order, cb) {
    response.push(order);
    cb();
  }, function(err) {
    cbErr(response);
  });
}
