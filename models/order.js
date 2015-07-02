var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  client: {type: Schema.Types.ObjectId, ref: 'User'},
  delivery_date: Date,
  delivery_address: String,
  status: Number,
  confirmation_number: Number,
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  restaurant: {type: Schema.Types.ObjectId, ref: 'Restaurant'}
});

module.exports = mongoose.model('Order', orderSchema);
