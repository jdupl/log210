var Restaurant = require('../models/restaurant');
var User = require('../models/user');
var config = require('../config/config');

exports.createRestaurant = function(req, res) {
    if (req.user.type === config.types.ADMIN) {
      if (req.body.restaurateur) {
        restaurateur = req.body.restaurateur;
        delete req.body.restaurateur;
        Restaurant.create(req.body, function(err, createdRestaurant) {
          User.update({_id: restaurateur}, {$push: {restaurants: createdRestaurant._id}}, function(err, updated) {
            res.status(201).json({id: createdRestaurant._id});
          });
        });
      } else {
        Restaurant.create(req.body, function(err, createdRestaurant) {
          res.status(201).json({id: createdRestaurant._id, message: 'Restaurant created with no restaurateur.'});
        });
      }
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

exports.getRestaurants = function(req, res) {
  if (req.user.type == config.types.ADMIN) {
    Restaurant.find(function(err, restaurants) {
      res.status(200).json(restaurants);
    });
  } else {
    res.status(401).json({message: 'Unauthorized. You are not an admin user'});
  }
};

exports.getRestaurant = function(req, res) {
  Restaurant.findOne({_id: req.params.id}, function(err, restaurant) {
    res.status(200).json(restaurant);
  });
};
