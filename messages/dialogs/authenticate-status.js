var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

module.exports = [
    function(session) {
        if (session.userData.apikey || session.privateConversationData.apikey) {
            if (session.userData.apikey) {
                session.send('Your API key and secret are stored as long as you don\'t sign out.');
                session.send('I\'ve stored the following API key for you ' + session.userData.apikey);
                session.endDialog('Your stored API secret starts with ' + session.userData.apisecret.substring(0, 3));
            }
            else {
                session.send('Your API key and secret are stored only in this conversation.');
                session.send('I\'ve stored the following API key for you ' + session.privateConversationData.apikey);
                session.endDialog('Your stored API secret starts with ' + session.privateConversationData.apisecret.substring(0, 3));
            }
        }
    
        else {
            session.send("You are not yet authenticated.");
            session.endDialog('You can start the authentication by typing \'auth\'');
        }
    }
];