var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const util = require('util');
const bfxapi = require('../bfx.js');
const favutils = require('./favorites-utils.js');

module.exports = [
    function (session) {
        var symbols = bfxapi.GetSymbols(session).then(function (symbols) {
            builder.Prompts.choice(session, 'Which coin are you interested in?', symbols, { listStyle: builder.ListStyle.list });
        });
    },
    function (session, results) {
        session.dialogData.symbol = results.response.entity;
        var markets = bfxapi.GetMarkets(session, results.response.entity).then(function (markets) {
            var symbolpairs = [];
            markets.forEach(function (element) {
                symbolpairs.push(session.dialogData.symbol + '/' + element)
            }, this);

            builder.Prompts.choice(session, 'Which market would you like to add to your favorites?', symbolpairs, { listStyle: builder.ListStyle.list });
        });
    },
    function (session, results) {
        favutils.userFavorites(session).push(results.response.entity);
        session.endDialog('Great, I\'ve added the coin to your favorites.');
    }
];