var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = module.exports = express();
var config = require('./backend/config/config');

//Database
mongoose.connect('mongodb://localhost/log210');//TODO dev config

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Routing
require('./backend/routes/routes')(app);

app.listen(config.server.port);
