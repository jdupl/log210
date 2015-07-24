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
    READY: 3,
    DELIVERING: 4
  },
  paypal: {
    'mode': 'sandbox',
    "client_id" : "Afirh9rGufGveCMm3AvxEG90aaqLSNWZrT0ln7NwSiziVE6u6O58z3czVc_pEASHgEXWMT2FCB5GOMSD",
    "client_secret" : "EAxBzBglZGmjCKGCNaW62xNSVqWroADIokYO4uHTNUKrFYZB6jxvPQVMZ6FF-RH-1k5sFY8ZHGRaaGTP"
  }
};
