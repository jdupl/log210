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
