var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        notUtils.retrieveNotifications(session.message.address.channelId, session.message.address.user.id).then(function (results) {
            if (results.length > 0)
                for (var result of results) {
                    switch (result.notificationtype) {
                        case "condition":
                            session.send(`${result.symbol} ${result.operator} ${result.price} - ${result.name}`);
                            break;
                        case "interval":
                            session.send(`${result.symbol} interval ${result.interval} (prev. price ${result.previousprice}) - ${result.name}`);
                            break;
                        default:
                            session.send(`${result.symbol} unkown type: ` + result.notificationtype);
                            break;
                    }

                }
            else
                session.send('You don\'t have any notifications.');
            session.endDialog();

        });
    }
];
