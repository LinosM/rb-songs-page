// Loading environmental variables here
if (process.env.NODE_ENV !== 'production') {
	console.log('loading dev environments');
	require('dotenv').config();
}
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dbConnection = require('./db'); // loads our connection to the mongo database
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

const clientP = mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost/rbsongs",
	{ useNewUrlParser: true, useUnifiedTopology: true }
  ).then(m => m.connection.getClient())

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
	secret: process.env.APP_SECRET || 'this is the default passphrase',
	store: MongoStore.create({ 
		mongooseConnection: dbConnection, 
		clientPromise: clientP}),
	resave: false,
	saveUninitialized: false
}));

// If its production environment!
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Error handler
app.use(function (err, req, res, next) {
	console.log('====== ERROR =======');
	console.error(err.stack);
	res.status(500);
});

// Starting Server
app.listen(PORT, () => {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
