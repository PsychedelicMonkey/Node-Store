require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Passport config
require('./config/passport')(passport);

// Initialize express
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		store: new MongoStore({
			mongoUrl: process.env.MONGO_URI,
		}),
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Method override middleware
app.use(
	methodOverride((req, res) => {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

// Global variables in templates
app.use((req, res, next) => {
	// Create cart cookie
	if (!req.cookies.cart) {
		res.cookie('cart', { items: [], total: 0 });
	}

	res.locals = {
		cart: req.cookies.cart,
		csrfToken: req.csrfToken(),
		error: req.flash('error'),
		success: req.flash('success'),
		user: req.user,
	};

	next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/auth/google', require('./routes/auth/google'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/products', require('./routes/products'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
	console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
