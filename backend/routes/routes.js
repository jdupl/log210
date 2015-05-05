var usersController = require('../controllers/users');

module.exports = function(app) {
  app.post('/api/users/', usersController.create);
};
