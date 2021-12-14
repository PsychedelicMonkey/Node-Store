const GoogleStrategy = require('passport-google-oauth2').Strategy;
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

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await User.findOne({ googleId: profile.id }).exec();

					if (!user) {
						const googleUser = {
							googleId: profile.id,
							firstName: profile.name.givenName,
							lastName: profile.name.familyName,
							email: profile.email,
						};

						user = await User.create(googleUser);
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
