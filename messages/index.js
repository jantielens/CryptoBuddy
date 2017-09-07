"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// *** DIALOGS: General
bot.dialog('/', function (session) {
    var firstname = session.message.address.user.name.split(' ')[0];

    session.send(`Hi ${firstname}, I'm your cryptocurrency buddy!`);
    session.send('You can type \'add favorite\' to get started, or \'help\' for more commands.');
    if (!session.userData.regularuser) {
        session.userData.regularuser = true;
        session.send('Also, since you are new here, a gentle reminder to check the privacy policy of this bot: https://github.com/jantielens/CryptoBuddy/blob/master/privacypolicy.md');
    }
    session.endDialog();
});

bot.dialog('help', function (session) {
    var mdMsg =
        `I can work with:
* price notifications (type 'add notification', 'show notifications', 'remove notification' ...)
* favorites (type 'add fav, show favs, remove fav ...)
* Your Bitfinex wallet (type 'wallet')
* Your Bitfinex orders (type 'orders')

You can cancel any action by typing 'stop'. For all the commands see: [this list](https://github.com/jantielens/CryptoBuddy/blob/master/commands.md)`;
    session.send(mdMsg);

    session.endDialog('Go to https://github.com/jantielens/CryptoBuddy to ask questions and/or provide feedback.');
}).triggerAction({
    matches: /^help$/i
});

bot.dialog('debug', function (session) {
    session.endDialog('Your current address is \n %s', JSON.stringify(session.message.address));
}).triggerAction({
    matches: /^debug$/i
});

bot.dialog('version', function (session) {
    var pjson = require('./package.json');
    session.send('Active build number #{Build.BuildNumber}#');
    session.endDialog('My version is %s', pjson.version);
}).triggerAction({
    matches: /^version$/i
});

// *** DIALOGS: Notifcations
bot.dialog('notifications-common-symbol', require('./dialogs/notifications-common-symbol'));
bot.dialog('notifications-add-interval', require('./dialogs/notifications-add-interval'));
bot.dialog('notifications-add-condition', require('./dialogs/notifications-add-condition'));

bot.dialog('addnotif', require('./dialogs/notifications-add')
).triggerAction({
    matches: /^add notification$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('addnotifshortcut', require('./dialogs/notifications-add-shortcut')
).triggerAction({
    onFindAction: function (context, callback) {
        // using this function instead of matches to get around the fact Skype thinks < is xml
        var origtext = context.message.text;
        if (context.message.sourceEvent.text)
            origtext = context.message.sourceEvent.text;

        var re = /^add \w{6} [<>] \d*\.?\d* .*$/i;
        var myArray = re.exec(origtext);

        if (myArray)
            callback(null, 1.1);
        else
            callback(null, 0);
    }
    //matches: /^add \w{6} [<>] \d*\.?\d*$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('removenotification', require('./dialogs/notifications-remove')
).triggerAction({
    matches: /^remove notification$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('shownotification', require('./dialogs/notifications-show')
).triggerAction({
    matches: /^show notifications$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

// *** DIALOGS: Favorites
bot.dialog('addfav', require('./dialogs/favorites-add')
).triggerAction({
    matches: [/^add fav$/i, /^add favorite$/i]
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('showfav', require('./dialogs/favorites-show')
).triggerAction({
    matches: [/^show favs$/i, /^favs$/i, /^f$/i, /^show favorites$/i, /^f$/i]
});

bot.dialog('removefav', require('./dialogs/favorites-remove')
).triggerAction({
    matches: [/^remove fav$/i, /^remove favorite$/i]
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('removeallfav', require('./dialogs/favorites-removeall')
).triggerAction({
    matches: [/^remove all favs$/i, /^remove all favorites$/i]
});


// *** DIALOGS: Wallet
bot.dialog('wallet', require('./dialogs/wallet-show')
).triggerAction({
    matches: [/^wallet$/i, /^w$/i]
});

// *** DIALOGS: Orders
bot.dialog('orders', require('./dialogs/orders-show')
).triggerAction({
    matches: [/^orders$/i, /^o$/i]
});

// *** DIALOGS: Authenticate
bot.dialog('auth', require('./dialogs/authenticate-do')
).triggerAction({
    matches: /^auth$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('logoff', function (session) {
    session.userData.apikey = null;
    session.userData.apisecret = null;
    session.privateConversationData.apikey = null;
    session.privateConversationData.apisecret = null;
    session.endDialog('Your API key and secret have been deleted.');
}).triggerAction({
    matches: [/^logoff$/i, /^log off$/i, /^signout$/i, /^lsign out$/i]
});

bot.dialog('status', require('./dialogs/authenticate-status')
).triggerAction({
    matches: [/^status$/i, /^s$/i]
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}