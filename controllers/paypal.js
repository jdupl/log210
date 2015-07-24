var paypal = require('paypal-rest-sdk');
var config = require('../config/config');

paypal.configure(config.paypal);

exports.createPayment = function(req, res) {
  console.log(req.body);
  var total = 0;
  for (var i = 0; i < req.body.items.length; i++) {
    total += req.body.items[i].price * req.body.items[i].quantity;
  }
  console.log(total);
  // we create the payment in a var for paypal
  var payment = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": 'http://log210.jduplessis.me/api/payment/execute',
      "cancel_url": 'http://log210.jduplessis.me/api/payment/cancel'
    },
    "transactions": [{
      "amount": {
        "total": total,
        "currency": "USD"
      },
      "description": "Paiement de votre commande"
    }]
  };

  // we create the payment
  paypal.payment.create(payment, function (error, payment) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      if (payment.payer.payment_method === 'paypal') {
        var redirectUrl;
        for (var i=0; i < payment.links.length; i++) {
          var link = payment.links[i];
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
          }
        }
        res.send({'redirect': redirectUrl});
      }
    }
  });
};

exports.executePayment = function(req, res){
  var payerId = req.param('PayerID');
  var paymentId = req.param('paymentId');

  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send("votre paiement a été accepté ! <br> <a href='/'>Retour au site.</a>");
    }
  });
};

exports.cancelPayment = function(req, res){
  res.send("Le paiement a été annulé");
};
