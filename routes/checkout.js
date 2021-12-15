const express = require('express');
const router = express.Router();

const { loginRequired } = require('../middleware/auth');
const { getCartProducts, getOrderTotal } = require('../utils/cart');

router.get('/', loginRequired, async (req, res) => {
	const { cart } = req.cookies;

	const products = await getCartProducts(cart);
	const orderTotal = getOrderTotal(products);

	return res.render('checkout', { products, orderTotal });
});

module.exports = router;
