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

        builder.Prompts.choice(session,
            "What is the condition you want to check?",
            "Last price is greater than a value|Last price is smaller than a value",
            { listStyle: builder.ListStyle.button }
        );
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.dialogData.operator = '>';
                break;
            case 1:
                session.dialogData.operator = '<';
                break;
            default:
                session.endDialog('Oops, wrong operator?')
                break;
        }
        builder.Prompts.number(session, 'What\'s the price you want to check?');
    },
    function (session, results) {
        session.dialogData.price = results.response;
        builder.Prompts.text(session, "What name would you like to give to this notification?");
    },
    function (session, results) {
        var sub = notUtils.getBaseNotification('condition', session.message.address);

        sub.symbol = session.dialogData.symbol;
        sub.operator = session.dialogData.operator;
        sub.price = session.dialogData.price;
        sub.name = results.response;

        notUtils.createNotification(sub).then((r) => {
            session.endDialog('Notification created!');
        }).catch((e) => {
            session.endDialog('Couldn\'t create notification: ' + e);
        });
    }
];