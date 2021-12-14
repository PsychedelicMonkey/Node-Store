const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				try {
					const user = await User.findOne({ email }).select('+password').exec();

					if (!user) {
						return done(null, false, { message: 'Incorrect credentials' });
					}

					const success = await user.checkPassword(password);

					if (!success) {
						return done(null, false, { message: 'Incorrect credentials' });
					}

					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
