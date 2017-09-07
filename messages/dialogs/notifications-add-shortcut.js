var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        var origtext = session.message.text;
        if (session.message.sourceEvent.text)
            origtext = session.message.sourceEvent.text;

        var sub = notUtils.getBaseNotification('condition', session.message.address);
        // example: add BTCUSD > 10
        sub.symbol = origtext.substring(4, 10).toUpperCase();
        sub.operator = origtext.substring(11, 12);
        var nameIndex = origtext.indexOf(' ', 13);
        sub.price = origtext.substring(13, nameIndex);
        sub.name = origtext.substring(nameIndex + 1);


        notUtils.createNotification(sub).then((r) => {
            session.endDialog('Notification created!');
        }).catch((e) => {
            session.endDialog('Couldn\'t create notification: ' + e);
        });
    }
];
