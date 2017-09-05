var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const util = require('util');
const bfxapi = require('../bfx.js');

module.exports = [
    function (session) {
        session.sendTyping();
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
    
        GetOrders(msg, session).then(function () {
            session.send(msg).endDialog();
        });
    }
];

function GetOrders(msg, session) {
    return new Promise((resolve, reject) => {
        bfxapi.getBfx(session).makeAuthRequest('/auth/r/orders', {}, function (err, resp) {
            if (err) reject(err);
            resp.forEach(function (element) {
                var symbol1 = element[3].substring(1, 4);
                var symbol2 = element[3].substring(4, 7);
                var amount = element[6];
                var ordertype = element[8];
                var price = element[16];

                msg.addAttachment(new builder.HeroCard(session)
                    .title('%s / %s', symbol1, symbol2)
                    .subtitle(ordertype)
                    .text('%s %s price %s %s\nTotal %s', amount, symbol1, price, symbol2, (amount * price).toFixed(2))
                );

            }, this);

            resolve(resp);
        });
    });
}