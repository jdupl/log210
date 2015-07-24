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
  },
  paypal: {
    api : {
      "host" : "api.sandbox.paypal.com",
      "client_id" : "ASyfoHd3tBmgQ927ehct845_BchJrOkfoHtrC0a_thKJUaL55U-OWS37FWBPPzOmnx6MH__aJCI6wBQz",
      "client_secret" : "ECgOLT3gA7Y5w_4o9-UihZFDVgvkJis9vYc7Vg9XvRplfWZqi2hoAxEJjXnhv6kUQ0IMMlfxz4v8Kfmk"
    }
  }
};
