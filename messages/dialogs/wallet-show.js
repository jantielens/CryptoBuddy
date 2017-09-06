var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const util = require('util');
const bfxapi = require('../bfx.js');
const authutils = require('./authenticate-utils.js');

module.exports = [
    function (session) {
        
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)

        createWalletMessage(msg, session).then(function () {
            session.send(msg).endDialog();
        }).catch((e) => {
            session.endDialog(e);
        });
    }
];

function createWalletMessage(msg, session) {
    return new Promise((resolve, reject) => {
        if (!authutils.isAuthenticated(session)) {
            reject('You are not yet authenticated, use the \'auth\' command to start authentication.');
            return;
        }
        session.sendTyping();
        bfxapi.GetWallets(session).then(function (w) {

            var symbols = [];
            w.forEach(function (element) {
                if (element[2] > 0 && element[1] != 'USD')
                    symbols.push(element);
            }, this);

            var actions = symbols.map(bfxapi.GetLatestPriceForElement);
            var results = Promise.all(actions);


            results.then(function (prices) {
                for (var i = 0; i < symbols.length; i++) {
                    var symbol = symbols[i][1];
                    var price = prices[i][6];
                    var amount = symbols[i][2];
                    var dailychangeperc = prices[i][5] * 100;
                    var lowprice = prices[i][9];
                    var highprice = prices[i][8];

                    msg.addAttachment(new builder.HeroCard(session)
                        .title(util.format('%s %d', symbol, amount))
                        .subtitle(util.format('Value USD %s'), (amount * price).toFixed(2))
                        .text(util.format('Last %s - Change %%%s\nLow %s - High %s', price, dailychangeperc.toFixed(3), lowprice.toFixed(3), highprice.toFixed(3)))
                    );
                }
                resolve();
            });
        });
    });
}
