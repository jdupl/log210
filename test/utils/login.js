exports.getToken = function(email, password, client, callback) {
  client
    .post('/api/login')
    .send({email: email, password: password})
    .end(function(err, res) {

      if (err) {
        callback(err, null);
      }

      var status = res.status;
      if (status === 200) {
        var token = res.body.token;
        callback(null, token);
      } else {
        callback(res.body, null);
      }
    });
};
