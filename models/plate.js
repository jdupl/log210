var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plateSchema = new Schema({
  name: String,
  description: String,
  price: Number
});

module.exports = mongoose.model('Plate', plateSchema);
