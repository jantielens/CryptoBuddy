var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const util = require('util');
const bfxapi = require('../bfx.js');
const favutils = require('./favorites-utils.js');

module.exports = [
    function (session) {
        builder.Prompts.confirm(session, 'Are you sure you want to remove all your favorites?');
    },
    function (session, results) {
        if (results.response == true) {
            favutils.replaceFavorites(session, []);
            session.endDialog('Ok, all your favorites are removed.');
        }
        else
            session.endDialog('No prob, no favorites removed.');
    }
];