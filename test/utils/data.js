var extend = require('extend');

fake_date = Date.now();
exports.fake_date = fake_date;

//Common data
var common_user = {
  phone: '123-123-1234',
  address: 'test-address',
  birth_date: fake_date
};

//Admin user fixture data
var admin_user = {
  email: 'admin@admin.com',
  password: 'admin',
  type: 'admin',
  name: 'admin-name',
};
exports.admin_user = extend(admin_user, common_user);

//Client user fixture data
var client_user = {
  email: 'client@test.com',
  password: 'test-pass',
  type: 'client',
  name: 'test-name',
};
exports.client_user = extend(client_user, common_user);

//Restaurateur user fixture data
var restaurateur_user = {
  email: 'restaurateur@test.com',
  password: 'test-pass',
  type: 'restaurateur',
  name: 'test-name',
  restaurants: []
};
exports.restaurateur_user = extend(restaurateur_user, common_user);

//Restaurant fixture data
exports.test_restaurant = {
  name: 'test-restaurant',
  menus: []
};

//Menu fixture data
exports.test_menu = {
  name: 'test-menu',
  plates: [
    {
      name: 'test-plate',
      description: 'test-description',
      price: 666
    },
    {
      name: 'test-plate-2',
      description: 'test-description-2',
      price: 6666
    }
  ],
  restaurant: undefined
};

//Empty menu fixture data
exports.test_empty_menu = {
  name: 'test-menu',
  plates: []
};

//Plate fixture data
exports.test_plate = {
  name: 'test-plate',
  description: 'test-description',
  price: 666
};
