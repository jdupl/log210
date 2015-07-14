var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deliverySchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  delivery_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);
