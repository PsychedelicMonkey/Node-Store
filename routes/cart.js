const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.post('/', async (req, res, next) => {
	try {
		const { productId, quantity } = req.body;
		const { cart } = req.cookies;

		const product = await Product.findById(productId);

		// Find item in cart
		const item = cart.items.find((item) => item._id === product._id.toString());

		if (typeof item != 'undefined') {
			item.quantity = quantity;
		} else {
			cart.items.push({ _id: productId, quantity });
		}

		// Calculate total no. of items in cart
		const total = cart.items.reduce((sum, item) => {
			return parseInt(sum) + parseInt(item.quantity);
		}, 0);

		// Set cart total
		cart.total = total;

		return res.cookie('cart', cart).redirect(`/products/${productId}`);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
