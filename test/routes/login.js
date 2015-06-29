var database = require('../utils/database');
var app = require('../../app');
var client = require('supertest')(app);
var assert = require('assert');
var User = require('../../models/user');
var Restaurant = require('../../models/restaurant');
var jwt = require('jsonwebtoken');
var fake_date = Date.now();
var data = require('../utils/data');
var config = require('../../config/config');
var login = require('../utils/login');
var extend = require('extend');

describe('/api/login', function() {
  describe('POST', function() {
    it('should get the JWT token', function(done) {
      User.create(data.client_user, function(err, created) {
        login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
          jwt.verify(token, config.jwt.secret, function(err, decoded) {
            assert.notEqual(decoded, undefined);
            assert.equal(decoded, created._id);
            done();
          });
        });
      });
    });
    it('should get a 400 because of wrong email', function(done) {
      User.create(data, function(err, created) {
        client
          .post('/api/login')
          .send({email: 'wrong', password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
    it('should get a 400 because of wrong password', function(done) {
      User.create(data.client_user, function(err, created) {
        client
          .post('/api/login')
          .send({email: created.email, password: 'wrong'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
  });
});
describe('/api/profile/', function() {
  describe('GET', function() {
    it("should return the logged in user's information", function(done) {
      User.create(data.client_user, function(err, created) {
        login.getToken(data.client_user.email, data.client_user.password, client, function(err, token) {
          client
            .get('/api/profile/')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.email, data.client_user.email);
              assert.equal(res.body.type, data.client_user.type);
              assert.equal(res.body.name, data.client_user.name);
              assert.equal(res.body.phone, data.client_user.phone);
              assert.equal(res.body.password, undefined);
              assert.equal(new Date(res.body.birth_date).getTime(), new Date(data.client_user.birth_date).getTime());
              assert.equal(res.body.address, 'test-address');
              done();
            });
        });
      });
    });
  });
});
describe('/api/profile/addresses', function() {
  describe('GET', function() {
    it('should return the primary and optional addresses of the user', function(done) {
      User.create(data.client_user_with_optional_addresses, function(err, createdUser) {
        login.getToken(data.client_user_with_optional_addresses.email, data.client_user_with_optional_addresses.password, client, function(err, token) {
          client
            .get('/api/profile/addresses')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 3);
              done();
            });
        });
      });
    });
  });
});
describe('/api/profile/restaurants', function() {
  describe('GET', function() {
    it('should get the restaurants of the restaurateur', function(done) {
      Restaurant.create(data.restaurateur_user, function(err, createdRestaurant) {
        var test_restaurateur = extend(test_restaurateur, data.restaurateur_user);
        var restaurants = [createdRestaurant._id];
        test_restaurateur.restaurants = restaurants;

        User.create(test_restaurateur, function(createdRestaurateur) {
          login.getToken(data.restaurateur_user.email, data.restaurateur_user.password, client, function(err, token) {
            client
              .get('/api/profile/restaurants')
              .set('Authorization', 'Bearer ' + token)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body[0]._id, createdRestaurant._id);
                assert.equal(res.body[0].name, createdRestaurant.name);
                done();
              });
          });
        });
      });
    });
  });
});
