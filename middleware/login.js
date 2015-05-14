const ANONYMOUS = 'anonymous';
exports.verify = function(req, res, next) {
  var authorizationHeader = req.get('Authorization');
  if (authorizationHeader) {
    next();
  } else {
    req.user = {
      type: ANONYMOUS
    };
    next();
  }
};
