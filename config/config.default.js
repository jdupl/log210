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
    'mode': 'sandbox',
    "client_id" : "Afirh9rGufGveCMm3AvxEG90aaqLSNWZrT0ln7NwSiziVE6u6O58z3czVc_pEASHgEXWMT2FCB5GOMSD",
    "client_secret" : "EAxBzBglZGmjCKGCNaW62xNSVqWroADIokYO4uHTNUKrFYZB6jxvPQVMZ6FF-RH-1k5sFY8ZHGRaaGTP"
  }
};
