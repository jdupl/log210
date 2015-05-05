var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  type: {type: String},
  name: {type: String},
  phone: {type: String},
  address: [String],
  birth_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
