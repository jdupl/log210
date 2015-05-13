fake_date = Date.now();
exports.fake_date = fake_date;
exports.fake_user = {
  email: 'test@test.com',
  password: 'test-pass',
  type: 'test-type',
  name: 'test-name',
  phone: '123-123-1234',
  address: ['test-address', 'test-address2'],
  birth_date: fake_date
};
exports.admin_user = {
  email: 'admin@test.com',
  password: 'admin-pass',
  type: 'admin',
  name: 'admin-name',
  phone: '123-123-1234',
  address: ['test-address', 'test-address2'],
  birth_date: fake_date
};
