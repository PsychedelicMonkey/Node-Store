const Product = require('../models/Product');

// Calculate total no. of items in cart
const getCartTotalItems = (cart) => {
	const total = cart.items.reduce((sum, item) => {
		return parseInt(sum) + parseInt(item.quantity);
	}, 0);

	return total;
};

// Return array of products in cart
const getCartProducts = async (cart) => {
	const products = await Product.find({ _id: { $in: cart.items } });

	products.map((prod) => {
		const cartProd = cart.items.find(
			(item) => item._id === prod._id.toString()
		);
		prod.quantity = cartProd.quantity;
		prod.total = prod.price * prod.quantity;
	});

	return products;
};

// Return the sum of the price all items in cart
const getOrderTotal = (products) => {
	return products.reduce((sum, item) => {
		return sum + item.total;
	}, 0);
};

module.exports = { getCartProducts, getCartTotalItems, getOrderTotal };
