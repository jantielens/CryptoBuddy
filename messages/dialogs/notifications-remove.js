var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var azure = require('azure-storage');

var tableSvc = azure.createTableService(process.env["cryptobuddyqueuestorage_STORAGE"]);
var tablename = 'subscriptions';

const notUtils = require('./notifications-utils.js');
var choiceData = {};

module.exports = [
    function (session) {
        notUtils.retrieveNotifications(session.message.address.channelId, session.message.address.user.id).then(function (results) {
            if (results.length > 0) {

                for (result of results) {
                    var label = `${result.symbol} ${result.operator} ${result.price}`;
                    choiceData[label] = {
                        "id": result.id,
                        "_self": result._self
                    };

                }
                builder.Prompts.choice(session, "Which notification do you want to remove?", choiceData);
            }
            else {
                session.send('You don\'t have any notifications.');
                session.endDialog();
            }
        });
    },
    function (session, results) {
        var choice = choiceData[results.response.entity];
        notUtils.deleteNotifications(choice._self).then(() => {
            session.send('Your notification has been deleted.');
            session.endDialog();
        }).catch((e) => {
            session.send('Mmm, couldn\'t delete your notification: ' + e);
            session.endDialog();
        });

    }
];




