var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  menus: [{type: Schema.Types.ObjectId, ref: 'Menu'}]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
