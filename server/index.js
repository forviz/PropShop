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

const dotenv = require('dotenv');
const logger = require('morgan');
const chalk = require('chalk');

const path = require('path');
const multer = require('multer');

const upload = multer();
// const upload = multer({ dest: path.join(__dirname, 'uploads') });

/* ************ Firebase Verify ************ */
const admin = require('firebase-admin');
const serviceAccount = require('../cert/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  databaseURL: 'https://propshop-638ef.firebaseio.com/',
});
/* ************ Firebase Verify End ************ */

dotenv.load({ path: '.env' });

const postController = require('./controllers/post');
const propertyController = require('./controllers/property');
const wishlistController = require('./controllers/wishlist');
const userController = require('./controllers/user');
const mapController = require('./controllers/map');

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
app.post(`${apiPrefix}/property/:id`, propertyController.update);
app.delete(`${apiPrefix}/property/:id`, propertyController.deleteProperty);

app.post(`${apiPrefix}/user`, userController.createUser);
app.get(`${apiPrefix}/user/:uid`, userController.getUser);
app.post(`${apiPrefix}/user/:id`, userController.updateUser);
app.post(`${apiPrefix}/contact/agent`, userController.contactAgent);
// app.post(`${apiPrefix}/email/verify`, userController.emailVerify);

app.get(`${apiPrefix}/wishlist/:id`, wishlistController.getWishlist);
app.post(`${apiPrefix}/wishlist/create`, wishlistController.createWishlist);
app.put(`${apiPrefix}/wishlist/update`, wishlistController.updateWishlist);
app.delete(`${apiPrefix}/wishlist/delete`, wishlistController.deleteWishlist);

app.post(`${apiPrefix}/map/nearbysearch`, mapController.getNearbySearch);
app.post(`${apiPrefix}/map/distancematrix`, mapController.getDistances);

app.post(`${apiPrefix}/verifytoken`, (req, res) => {
  const idToken = req.param('token');
  // let message = '22';

  admin.auth().verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;

    res.json({
      data_uid: uid,
      data: decodedToken,
      msg: 'ss',
    });
    // ...
  }).catch((error) => {
    // Handle error
    res.json({
      data: error,
      msg: 'error',
    });
    console.log(error);
  });
});

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
