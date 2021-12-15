const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/:id', async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);

		return res.render('product', { title: product.name, product });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
