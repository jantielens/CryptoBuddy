var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const bfxapi = require('../bfx.js');

module.exports = [
    function (session) {
        builder.Prompts.choice(session,
            "How long would you like to store your API keys?",
            "Only in this conversation|As long as I don't sign out",
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        //var currentkey = session.userData.apikey;
        //session.send('Your current key is: %s', currentkey);
        session.dialogData.howlong = results.response.index;
        builder.Prompts.text(session, 'What is your Bitfinex API key?');
    },
    function (session, results) {
        if (session.dialogData.howlong == 0) {
            session.privateConversationData.apikey = results.response;
            session.userData.apikey = null;;
        }
        else {
            session.privateConversationData.apikey = null;
            session.userData.apikey = results.response;
        }

        builder.Prompts.text(session, 'What is your Bitfinex API secret?');
    },
    function (session, results) {
        if (session.dialogData.howlong == 0) {
            session.privateConversationData.apisecret = results.response;
            session.userData.apisecrety = null;;
        }
        else {
            session.privateConversationData.apisecret = null;
            session.userData.apisecret = results.response;
        }
        if (session.dialogData.howlong == 0)
            session.endDialog('I\'ve stored them in this conversation!');
        else
            session.endDialog('I\'ve stored them for you, remember to log out to delete them!');
    }
];