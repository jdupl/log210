var extend = require('extend');

var config = require('./config.default');

if (process.env.NODE_ENV) {
  var envConfig = require('./config.' + process.env.NODE_ENV) || {};
}

extend(true, config, envConfig);

module.exports = config;
