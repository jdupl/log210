var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  restaurateur: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
