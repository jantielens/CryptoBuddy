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

        builder.Prompts.number(session, 'How long should be the interval (in seconds)?');
    },
    function (session, results) {
        var sub = notUtils.getBaseNotification('recurringtickernotification', session.message.address, results.response);

        sub.symbol = session.dialogData.symbol;
        
        notUtils.createNotification(sub, results.response).then((r) => {
            session.endDialog('Notification created!');
        }).catch((e) => {
            session.endDialog('Couldn\'t create subscription: ' + e);
        });
    }
];