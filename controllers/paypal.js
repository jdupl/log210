exports.createPayment = function(total, req, res){
  // we create the payment in a var for paypal
  var payment = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://yoururl.com/execute",
      "cancel_url": "http://yoururl.com/cancel"
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
    } else {
      if(payment.payer.payment_method === 'paypal') {
        req.session.paymentId = payment.id;
        var redirectUrl;
        for(var i=0; i < payment.links.length; i++) {
          var link = payment.links[i];
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
          }
        }
        res.redirect(redirectUrl);
      }
    }
  });
};

// we execute the payment
exports.executePayment = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');

  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
      res.send("Aucune erreur lors de l'execution");
    }
  });
};

// when we cancel the payment
exports.cancelPayment = function(req, res){
  res.send("Le paiement a été annulé");
};
