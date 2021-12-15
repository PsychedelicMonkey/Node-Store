const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/:id', async (req, res, next) => {
	try {
		const { cart } = req.cookies;

		const product = await Product.findById(req.params.id);
		let quantity = 1;
		let itemInCart = false;

		// Check if item is in cart
		const item = cart.items.find((item) => item._id === product._id.toString());
		item ? (quantity = item.quantity) : 1;
		item ? (itemInCart = true) : (itemInCart = false);

		return res.render('product', {
			title: product.name,
			product,
			quantity,
			itemInCart,
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
