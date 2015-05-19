var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var bodyParser = require('body-parser');
var app = module.exports = express();
var config = require('./config/config');
var User = require('./models/user');

//Database
mongoose.connect(config.db.url);

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//Passport configuration
var opts = {};
opts.secretOrKey = config.jwt.secret;
opts.authScheme = 'Bearer';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({_id: jwt_payload}).select('-password -__v').exec(function(err, user) {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

//Routing
require('./routes/routes')(app);

app.listen(config.server.port);
