const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	req.flash('error', 'Error message');
	return res.render('home', { title: 'Home Page' });
});

module.exports = router;
