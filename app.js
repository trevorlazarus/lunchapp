var express = require('express');
var domain = require('domain');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./routes/api');
var evernoteRoutes = require('./routes/evernote');

var models = require('./models');

var local_settings = require('./local_settings').settings;

var app = express();

// register view engine with underscore templates
app.engine('html', require('consolidate').underscore);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon());
app.use(favicon(__dirname + '/public/favicon.ico', {}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: 'lunchTimer',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: null
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

console.log('MongoDB URL:' + local_settings.MONGO_URL);

if (app.get('env') === 'development') {
    models.init(local_settings.MONGO_URL,'app_dev');

    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else if (app.get('env') === 'production') {
    models.init(local_settings.MONGO_URL,'app_prod');
} else {
    modles.init(local_settings.MONGO_URL,'test');
}

app.use('/', routes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/evernote', evernoteRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(req, res, next) {
  var reqd = domain.create();
  reqd.on('error', function(err) {
    res.render('error', {title:'error'});
  });
  reqd.run(next);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
