var config = {
  db: {
    url: 'mongodb://localhost/test'
  },
  jwt: {
    secret: 'test'
  }
}

var stubTransporter = {
  sendMail: function(mailOptions, callback) { callback(null, null); }
}

config.transporter = stubTransporter;

module.exports = config;
