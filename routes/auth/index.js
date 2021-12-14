const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { isGuest } = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/login', isGuest, (req, res) => {
	return res.render('auth/login');
});

router.get('/register', isGuest, (req, res) => {
	return res.render('auth/register');
});

router.get('/logout', (req, res) => {
	req.logout();

	return res.redirect('/');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureFlash: true,
	})
);

router.post(
	'/register',
	body('firstName').notEmpty().withMessage('Please enter your first name'),
	body('lastName').notEmpty().withMessage('Please enter your last name'),
	body('email').notEmpty().withMessage('Please enter a valid email address'),
	body('password').notEmpty().withMessage('Please enter a password'),
	body('password2').notEmpty().withMessage('Please confirm your password'),

	// Check if email is already registered
	body('email').custom((email) => {
		return User.findOne({ email }).then((user) => {
			if (user) {
				return Promise.reject(
					'The email address you entered is already registered'
				);
			}
		});
	}),

	// Check if passwords match
	body('password2').custom((value, { req }) => {
		if (value != req.body.password) {
			throw new Error('Passwords must match');
		}

		return true;
	}),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { firstName, lastName, email, password } = req.body;

			await User.create({ firstName, lastName, email, password });

			return res.status(201).json({ msg: 'ok' });
		} catch (err) {
			return next(err);
		}
	}
);

module.exports = router;
