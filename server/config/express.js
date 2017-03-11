/**
 * Express configuration
 */

'use strict';

var express = require('express');
//var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var debug = require('debug')('app:express');
var passport = require('passport');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', `${config.root}/server/views`);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  if(env === 'production') {
    debug('Using production bundle');
//    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(config.root));
    app.set('appPath', config.root);
    app.use(morgan('dev'));
  }
  if(env === 'development' || env === 'test') {
    debug('Using development paths');
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
