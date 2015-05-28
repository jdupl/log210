var Restaurant = require('../models/restaurant');
var config = require('../config/config');

exports.createRestaurant = function(req, res) {
    if (req.user.type === config.types.ADMIN) {
      Restaurant.create(req.body, function(err, createdRestaurant) {
        if (req.body.restaurateur) {
          res.status(201).json({id: createdRestaurant._id});
        } else {
          res.status(201).json({id: createdRestaurant._id, message: 'Restaurant created with no restaurateur.'});
        }
      });
    } else {
      res.status(401).json({message: 'You cannot create a restaurant, you are not a admin'});
    }
};

exports.deleteRestaurant = function(req, res) {
  if(req.user.type === config.types.ADMIN) {
    Restaurant.remove({_id: req.params.id}, function(err, count) {
      res.status(200).json({});
    });
  } else {
    res.status(401).json({message:'You cannot create a restaurant, you are not a admin'});
  }
};

exports.updateRestaurant = function(req, res) {
  if(req.user.type === config.types.ADMIN) {
    Restaurant.update({_id: req.params.id}, req.body, function(err, count) {
      res.status(200).json({message: 'The restaurant is updated'});
    });
  } else {
    res.status(401).json({message:'You cannot modify a restaurant, you are not a admin'});
  }
};
