var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        session.beginDialog('notifications-common-symbol');
    },
    function (session, results) {
        var pair = results.response;
        session.dialogData.symbol = pair;

        builder.Prompts.number(session, 'How big should the interval be?');
    },
    function (session, results) {
        session.dialogData.interval = results.response;
        builder.Prompts.text(session, "What name would you like to give to this notification?");
    },
    function (session, results) {
        var sub = notUtils.getBaseNotification('interval', session.message.address);

        sub.symbol = session.dialogData.symbol;
        sub.interval = session.dialogData.interval;
        sub.previousprice = 0;
        sub.isfirstun = true;
        sub.name = results.response;

        notUtils.createNotification(sub).then((r) => {
            session.endDialog('Notification created!');
        }).catch((e) => {
            session.endDialog('Couldn\'t create notification: ' + e);
        });
    }
];