const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		sku: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', Product);
