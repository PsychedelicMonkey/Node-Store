const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema(
	{
		completed: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', Order);
