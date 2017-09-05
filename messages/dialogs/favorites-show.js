var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const util = require('util');
const bfxapi = require('../bfx.js');
const favutils = require('./favorites-utils.js');

module.exports = [
    function (session) {
        session.sendTyping();
        // ensure bfx
        bfxapi.getBfx(session);

        var favs = favutils.userFavorites(session);
        var pairCodes = [];
        favs.forEach(function (element) {
            var pair = element.replace(/ /g, '');
            pair = pair.replace('/', '');
            pairCodes.push(pair);
        }, this);

        var actions = pairCodes.map(bfxapi.GetLatestPrice);
        var results = Promise.all(actions);

        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)

        results.then(function (prices) {
            for (var i = 0; i < favs.length; i++) {
                var symbol = favs[i];
                var price = prices[i][6];
                var dailychangeperc = prices[i][5] * 100;
                var lowprice = prices[i][9];
                var highprice = prices[i][8];

                msg.addAttachment(new builder.HeroCard(session)
                    .title(util.format('%s', symbol))
                    .subtitle(util.format('Last %s'), price)
                    .text(util.format('Change %%%s\nLow %s - High %s', dailychangeperc.toFixed(3), lowprice.toFixed(3), highprice.toFixed(3)))
                );
            }
            session.send(msg);
            session.endDialog();
        });
    }
];