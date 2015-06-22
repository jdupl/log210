module.exports = {
  server: {
    port: 3000
  },
  db: {
    url: 'mongodb://localhost/dev'
  },
  jwt: {
    secret: 'secret'
  },
  types: {
    ADMIN: 'admin',
    CLIENT: 'client',
    ANONYMOUS: 'anonymous',
    RESTAURATEUR: 'restaurateur'
  },
  status: {
    ORDERED: 1,
    PREPARING: 2,
    READY: 3
  }
};
