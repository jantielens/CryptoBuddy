var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

const notUtils = require('./notifications-utils.js');

module.exports = [
    function (session) {
        builder.Prompts.choice(session,
            "What kind of notification would you like to add?",
            "Conditional",
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('notifications-add-condition');
                break;
            default:
                sesssion.endDialog('Oops, wrong type??');
                break;
        }
    },
    function (session, results) {
        session.endDialog();
    }
];
