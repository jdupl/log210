var tungus = require('tungus');
global.TUNGUS_DB_OPTIONS = { memStore: true };
var mongoose = require('mongoose');
var config = require('../../config/config');

beforeEach(function (done) {

 function clearDB() {
   for (var i in mongoose.connection.collections) {
     mongoose.connection.collections[i].remove(function() {});
   }
   return done();
 }

 if (mongoose.connection.readyState === 0) {
   mongoose.connect(config.db.url, function (err) {
     if (err) {
       throw err;
     }
     return clearDB();
   });
 } else {
   return clearDB();
 }
});

afterEach(function (done) {
 mongoose.disconnect();
 return done();
});
