/* eslint-disable no-console */
require('babel-register');
require('babel-polyfill');

// const _ = require('lodash');
// const moment = require('moment');
const express = require('express');
const flash = require('express-flash');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('morgan');
const chalk = require('chalk');

const path = require('path');
const multer = require('multer');

const upload = multer();
// const upload = multer({ dest: path.join(__dirname, 'uploads') });

dotenv.load({ path: '.env' });

const postController = require('./controllers/post');
const propertyController = require('./controllers/property');
const wishlistController = require('./controllers/wishlist');
const userController = require('./controllers/user');
const mapController = require('./controllers/map');
const newsController = require('./controllers/news');
const contentController = require('./controllers/content');

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.on('error', () => {
//   console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
//   process.exit();
// });

/**
 * Create Express server.
 */
const app = express();

app.set('port', process.env.PORT || 4000);
app.use(compression());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CIC-Content-Type');
  next();
};

app.use(allowCrossDomain);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));

app.use(flash());
app.use(logger('dev'));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// const contentDeliveryAuthentication = (req, res, next) => {
//   const token = _.replace(req.get('Authorization'), 'Bearer ', '');
//   if (token !== '') {
//     console.log('token', token);
//   }
//   next();
// };

const apiPrefix = '/api/v1';

app.post(`${apiPrefix}/media`, upload.single('file'), postController.uploadFile);
app.delete(`${apiPrefix}/media/:assetId`, postController.deleteFile);
app.get(`${apiPrefix}/posts`, postController.queryPosts);
app.post(`${apiPrefix}/posts`, postController.createPost);

app.get(`${apiPrefix}/properties`, propertyController.queryProperties);
app.post(`${apiPrefix}/property`, propertyController.create);
app.put(`${apiPrefix}/property/:id`, propertyController.update);
app.delete(`${apiPrefix}/property/:id`, propertyController.deleteProperty);
app.post(`${apiPrefix}/property/:id/image`, propertyController.addImage);
app.post(`${apiPrefix}/property/:id/images`, propertyController.addImages);
app.post(`${apiPrefix}/property/share/email`, propertyController.shareProperty);

app.post(`${apiPrefix}/user`, userController.createUser);
app.get(`${apiPrefix}/user/:uid`, userController.getUser);
app.post(`${apiPrefix}/user/:id`, userController.updateUser);
app.post(`${apiPrefix}/contact/agent`, userController.contactAgent);
// app.post(`${apiPrefix}/email/verify`, userController.emailVerify);

app.get(`${apiPrefix}/wishlist/:id`, wishlistController.getWishlist);
app.post(`${apiPrefix}/wishlist/create`, wishlistController.createWishlist);
app.put(`${apiPrefix}/wishlist/update`, wishlistController.updateWishlist);
app.delete(`${apiPrefix}/wishlist/delete`, wishlistController.deleteWishlist);
app.get(`${apiPrefix}/wishlist/user/:id`, wishlistController.getUserWishlist);

app.post(`${apiPrefix}/map/nearbysearch`, mapController.getNearbySearch);
app.post(`${apiPrefix}/map/distancematrix`, mapController.getDistances);

app.get(`${apiPrefix}/news`, newsController.getNews);

app.get(`${apiPrefix}/content/:id`, contentController.get);

/**
 * CIC App codebase: WEBUI
 */
app.use(express.static(path.join(__dirname, 'webui')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'webui', 'index.html'));
});

/**
 * Start Express server.
 */

app.listen(app.get('port'), () => {
  console.log('%s CICAPP service is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
