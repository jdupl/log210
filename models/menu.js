var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
  name: String,
  plates: [{type: Schema.Types.ObjectId, ref: 'Plate'}]
});

module.exports = mongoose.model('Menu', menuSchema);
