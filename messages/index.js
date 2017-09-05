"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

const bfxapi = require('./bfx.js');

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
    session.send("Hi, I'm your cryptocurrency buddy!");
    session.send('You said: ' + session.message.textFormat + '-' + session.message.text);
    session.send(JSON.stringify(session.message));
    session.endDialog('You can use the following commands: wallet, orders, show fav, add fav, remove fav, auth, status, version.');
});

bot.dialog('address', function (session) {
    session.endDialog('Your current address is \n %s', JSON.stringify(session.message.address));
}).triggerAction({
    matches: /^address$/i
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
bot.dialog('notifications-add-recurringticker', require('./dialogs/notifications-add-recurringticker'));
bot.dialog('notifications-add-condition', require('./dialogs/notifications-add-condition'));

bot.dialog('addnotif', require('./dialogs/notifications-add')
).triggerAction({
    matches: /^add notification$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('addnotifshortcut', require('./dialogs/notifications-add-shortcut')
).
    triggerAction({
        onFindAction: function (context, callback) {
            // using this function instead of matches to get around the fact Skype thinks < is xml
            var origtext = context.message.text;
            if (context.message.sourceEvent.text)
                origtext = context.message.sourceEvent.text;

            var re = /^add \w{6} [<>] \d*\.?\d*$/i;
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

bot.dialog('removeallnotif', require('./dialogs/notifications-remove')
).triggerAction({
    matches: /^remove notification$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('show', require('./dialogs/notifications-show')
).triggerAction({
    matches: /^show notifications$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

// *** DIALOGS: Favorites
bot.dialog('addfav', require('./dialogs/favorites-add')
).triggerAction({
    matches: /^add fav$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});

bot.dialog('showfav', require('./dialogs/favorites-show')
).triggerAction({
    matches: [/^show favs$/i, /^favs$/i, /^f$/i]
});

bot.dialog('removefav', require('./dialogs/favorites-remove')
).triggerAction({
    matches: /^remove fav$/i
}).cancelAction('cancelAction', 'Ok, cancelling your action!', {
    matches: /^nevermind$|^cancel$|^stop/i
});;

bot.dialog('removeallfav', require('./dialogs/favorites-removeall')
).triggerAction({
    matches: /^remove all favs$/i
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
});;

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