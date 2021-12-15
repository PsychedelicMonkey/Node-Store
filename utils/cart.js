// Calculate total no. of items in cart
const getCartTotalItems = (cart) => {
	const total = cart.items.reduce((sum, item) => {
		return parseInt(sum) + parseInt(item.quantity);
	}, 0);

	return total;
};

module.exports = { getCartTotalItems };
