fake_date = Date.now();
exports.fake_date = fake_date;
exports.fake_user = {
  email: 'test@test.com',
  password: 'test-pass',
  type: 'test-type',
  name: 'test-name',
  phone: '123-123-1234',
  address: 'test-address',
  birth_date: fake_date
};
exports.admin_user = {
  email: 'admin@admin.com',
  password: 'admin',
  type: 'admin',
  name: 'admin-name',
  phone: '123-123-1234',
  address: 'test-address',
  birth_date: fake_date
};
exports.client_user = {
  email: 'client@test.com',
  password: 'test-pass',
  type: 'client',
  name: 'test-name',
  phone: '123-123-1234',
  address: 'test-address',
  birth_date: fake_date
};
exports.restaurateur_user = {
  email: 'restaurateur@test.com',
  password: 'test-pass',
  type: 'restaurateur',
  name: 'test-name',
  phone: '123-123-1234',
  address: 'test-address',
  birth_date: fake_date
};
//TODO Refactor with extend library
