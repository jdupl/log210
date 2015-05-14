var mongoose = require('mongoose');
var express = require('express');
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
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//Routing
require('./routes/routes')(app);

app.listen(config.server.port);
