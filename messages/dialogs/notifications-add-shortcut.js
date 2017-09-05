var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        var sub = notUtils.getBaseNotification('condition', session.message.address);
        // example: add BTCUSD > 10
        sub.symbol = session.message.text.substring(4,10).toUpperCase();
        sub.operator = session.message.text.substring(11,12);
        sub.price = session.message.text.substring(13);

        notUtils.createNotification(sub).then((r) => {
            session.endDialog('Notification created!');
        }).catch((e) => {
            session.endDialog('Couldn\'t create notification: ' + e);
        });
    }
];
