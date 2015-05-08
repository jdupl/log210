var extend = require('extend');

var config = require('./config.default');

//Environment configuration
var envConfig = require('./config.' + process.env.NODE_ENV);
extend(true, config, envConfig);

module.exports = config;
