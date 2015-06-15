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

    var restaurant_id = req.params.id;

    User.update({restaurants: restaurant_id}, {$pull: {restaurants: restaurant_id}}, {multi: true}, function(err, updated) {
      Restaurant.remove({_id: restaurant_id}, function(err, count) {
        res.status(200).json({});
      });
    });
  } else {
    res.status(401).json({message:'You cannot create a restaurant, you are not a admin'});
  }
};

exports.updateRestaurant = function(req, res) {
  var restaurant_id = req.params.id;
  if(req.user.type === config.types.ADMIN) {
    if (req.body.restaurateur) {
      var new_restaurateur_id = req.body.restaurateur;
      delete req.body.restaurateur;

      //Delete the reference to the old restaurateur
      updateRestaurantReferenceInRestaurateur(restaurant_id, new_restaurateur_id, function(err) {
        Restaurant.update({_id: restaurant_id}, req.body, function(err, count) {
          res.status(200).json({message: 'The restaurant is updated'});
        });
      });
    } else {
      Restaurant.update({_id: restaurant_id}, req.body, function(err, count) {
        res.status(200).json({message: 'The restaurant is updated'});
      });
    }
  } else {
    res.status(401).json({message:'You cannot modify a restaurant, you are not a admin'});
  }
};

function updateRestaurantReferenceInRestaurateur(restaurant_id, new_restaurateur_id, callback) {
  User.findOne({restaurants: restaurant_id}, function(err, old_restaurateur) {
    if(old_restaurateur !== null) {
      var old_restaurateur_id = old_restaurateur._id;
      if (old_restaurateur_id === new_restaurateur_id) {
        //Since both the old and the new restaurateur are the same, no need to update
        callback(null);
      } else {
        //Remove the restaurant reference in the old restaurateur
        User.update({_id: old_restaurateur_id}, {$pull: {restaurants: restaurant_id}}, function(err, updated) {
          //Add the restaurant reference in the new restaurateur
          User.update({_id: new_restaurateur_id}, {$push: {restaurants: restaurant_id}}, function(err, updated) {
            callback(null);
          });
        });
      }
    }
  });
}

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

exports.getRestaurateur = function(req, res) {
  User.findOne({restaurants: req.params.id}, function(err, restaurateur) {
    res.status(200).json(restaurateur);
  });
};
