var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const bfxapi = require('../bfx.js');

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
                symbolpairs.push(session.dialogData.symbol + ' / ' + element)
            }, this);

            builder.Prompts.choice(session, 'Great, which market are you interested in?', symbolpairs, { listStyle: builder.ListStyle.list });
        });
    },
    function (session, results) {
        var pair = results.response.entity.replace(/ /g, '');
        pair = pair.replace('/', '');

        session.endDialogWithResult({ response: pair });
    }
];

