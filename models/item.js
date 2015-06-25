var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  plate: {type: Schema.Types.ObjectId, ref: 'Plate'},
  quantity: Number
});

module.exports = mongoose.model('Item', itemSchema);
