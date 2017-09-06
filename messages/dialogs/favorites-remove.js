var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const favutils = require('./favorites-utils.js');

module.exports = [
    function (session) {
        session.send('Which favorite would you like to remove?');
        builder.Prompts.choice(session, 'Which favorite would you like to remove?', favutils.userFavorites(session), { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        var favs = favutils.userFavorites(session);
        var newFavs = [];
        favs.forEach(function (element) {
            if (element != results.response.entity)
                newFavs.push(element);
        }, this);
        favutils.replaceFavorites(session, newFavs);
        session.endDialog('Done!');
    }
];