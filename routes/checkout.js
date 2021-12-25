const express = require('express');
const router = express.Router();

const { loginRequired } = require('../middleware/auth');
const { getCartProducts, getOrderTotal } = require('../utils/cart');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

router.get('/', loginRequired, async (req, res) => {
	const { cart } = req.cookies;

	const products = await getCartProducts(cart);
	const orderTotal = getOrderTotal(products);

	return res.render('checkout', { products, orderTotal });
});

router.post('/', loginRequired, async (req, res, next) => {
	try {
		const { cart } = req.cookies;

		console.log(cart);

		const order = await new Order({ user: req.user });
		await order.save();

		cart.items.map(async ({ _id, quantity }) => {
			await OrderItem.create({
				order,
				product: _id,
				quantity,
			});
		});

		return res.send('ok');
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
