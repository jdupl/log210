var Restaurant = require('../models/restaurant');

exports.createRestaurant = function(req, res) {
    Restaurant.create(req.body, function(err, createdRestaurant) {
      res.status(201).json({id: createdRestaurant._id});
    });
};
