var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        notUtils.retrieveNotifications(session.message.address.channelId, session.message.address.user.id).then(function (results) {
            if (results.length > 0)
                for (result of results) {
                    session.send(`${result.symbol} ${result.operator} ${result.price}`);
                }
            else
                session.send('You don\'t have any notifications.');
            session.endDialog();

        });
    }
];
