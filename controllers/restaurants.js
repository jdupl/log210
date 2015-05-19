var Restaurant = require('../models/restaurant');
var config = require('../config/config');

exports.createRestaurant = function(req, res) {
    if (req.user.type === config.types.CONTRACTOR) {
      Restaurant.create(req.body, function(err, createdRestaurant) {
        res.status(201).json({id: createdRestaurant._id});
      });
    } else {
      res.status(401).json({message: 'You cannot create a restaurant, you are not a contractor'});
    }
};

exports.deleteRestaurant = function(req, res) {
  if(req.user.type === config.types.CONTRACTOR) {
    Restaurant.remove({_id: req.params.id}, function(err, count) {
      res.status(200).json({});
    });
  } else {
    res.status(401).json({message:'You cannot create a restaurant, you are not a contractor'});
  }
};

exports.updateRestaurant = function(req, res) {
  Restaurant.update({_id: req.params.id}, req.body, function(err, count) {
    res.status(200).json({message: 'The restaurant is updated'});
  });
};
