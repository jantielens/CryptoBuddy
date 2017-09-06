var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

module.exports = [
    function (session) {
        builder.Prompts.choice(session,
            `What kind of notification would you like to add?
(Condition: e.g. when BTCUSD < 3000, Interval: e.g. every time BTCUSD changes 100)`,
            "Condition|Interval",
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('notifications-add-condition');
                break;
            case 1:
                session.beginDialog('notifications-add-interval');
                break;
            default:
                session.endDialog('Oops, wrong type??');
                break;
        }
    },
    function (session) {
        session.endDialog();
    }
];
