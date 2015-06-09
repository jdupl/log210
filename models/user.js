var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  type: {type: String},
  name: {type: String},
  phone: {type: String},
  address: String,
  birth_date: { type: Date, default: Date.now },
  restaurants: [{type: Schema.Types.ObjectId, ref: 'Restaurant'}],
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
  });
});

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
