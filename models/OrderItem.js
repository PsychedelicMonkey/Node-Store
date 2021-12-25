const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItem = new Schema({
	order: {
		type: Schema.Types.ObjectId,
		ref: 'Order',
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	quantity: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('OrderItem', OrderItem);
