const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/', async (req, res, next) => {
	try {
		const products = await Product.find();

		return res.render('home', { title: 'Home Page', products });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
