var config = require('../config/config');

var extend = require('extend');
var async = require('async');

var twilio = (function() {
    var instance;

    function init() {
        function getStatusMessage(status) {
            if (status === 1) {
                return "La commande a été passée."
            } else if (status === 2) {
                return "Nous préparons la commande."
            } else if (status === 3) {
                return "La commande est prête pour la livraison."
            }
        }

        return {
            sendConfirmationSMS: function(number, msg, callback) {
                var client = require('twilio')(config.twilio.sid, config.twilio.token);
                client.sms.messages.create({
                    to: number,
                    from: "+15146123752",
                    body: getStatusMessage(msg),
                }, callback);
            },
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = twilio;