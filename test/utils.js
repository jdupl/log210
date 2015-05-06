var mongoose = require('mongoose');
fake_date = Date.now();
exports.fake_date = fake_date;
exports.data = {
  email: 'test@test.com',
  password: 'test-pass',
  type: 'test-type',
  name: 'test-name',
  phone: '123-123-1234',
  address: ['test-address', 'test-address2'],
  birth_date: fake_date
};
var config = require('../backend/config/config');

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
