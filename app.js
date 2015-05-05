var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = module.exports = express();

//Database
mongoose.connect('mongodb://localhost/log210');

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Routing
require('./backend/routes/routes')(app);

app.listen(3000);
