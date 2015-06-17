var async = require('async');

var config = require('../config/config');

var Restaurant = require('../models/restaurant');
var Menu = require('../models/menu');
var Plate = require('../models/plate');

//Persist the menu and add it to the list
//of menus in the restaurant
exports.create = function(req, res) {
  if (req.user.type === config.types.RESTAURATEUR) {
    createPlates(req.body.plates, function(err, plates_id) {

      //Add the list of plates id to the body
      req.body.plates = plates_id;

      //Save the restaurant id and cleanup the request body
      var restaurant_id = req.body.restaurant;
      delete req.body.restaurant;

      //Create the menu with the request body
      Menu.create(req.body, function(err, createdMenu) {
        //Add the menu to the list of menus in the restaurant
        Restaurant.update({_id: restaurant_id}, {$push: {menus: createdMenu._id}}, function(err, updated) {
          res.status(201).json({message: 'Menu created'});
        });
      });
    });
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
};

//For each plate, persist it's information
//And add it's id to the list of plates id
function createPlates(plates, callback) {
  var plates_id = [];

  async.eachSeries(plates, function(plate, next) {
    Plate.create(plate, function(err, createdPlate) {
      plates_id.push(createdPlate._id);
      next(err);
    });
  }, function(err) {
    callback(err, plates_id);
  });
}
