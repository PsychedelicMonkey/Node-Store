const express = require('express');
const router = express.Router();

const {
	getCartProducts,
	getCartTotalItems,
	getOrderTotal,
} = require('../utils/cart');
const Product = require('../models/Product');

router.get('/', async (req, res, next) => {
	try {
		const { cart } = req.cookies;

		const products = await getCartProducts(cart);
		const orderTotal = getOrderTotal(products);

		return res.render('cart', { products, orderTotal });
	} catch (err) {
		return next(err);
	}
});

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

		// Set cart total
		cart.total = getCartTotalItems(cart);

		return res.cookie('cart', cart).redirect(`/products/${productId}`);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id', (req, res) => {
	const { cart } = req.cookies;

	const items = cart.items.filter((item) => item._id !== req.params.id);
	cart.items = items;

	// Set cart total
	cart.total = getCartTotalItems(cart);

	req.flash('success', 'Item removed from cart');
	return res.cookie('cart', cart).redirect('/cart');
});

module.exports = router;
