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
  twilio: {
    sid: 'AC342f063b887b150f797f30aa28ff6be5',
    token: 'ce19ff3470b1fa984f486b1adae561b2'
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
