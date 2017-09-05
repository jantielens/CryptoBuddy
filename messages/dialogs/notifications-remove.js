var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var azure = require('azure-storage');

var tableSvc = azure.createTableService(process.env["cryptobuddyqueuestorage_STORAGE"]);
var tablename = 'subscriptions';

module.exports = [
    function (session) {
        retrieveSubscriptions(session).then(() => {
            session.endDialog();
        }).catch((e) => {
            session.endDialog(e);
        });
    }
]

function retrieveSubscriptions(session) {
    console.log('Retrieving subscription ...')
    return new Promise((resolve, reject) => {
        var channelid = session.message.address.channelId;
        var userid = session.message.address.user.id;
        var partitionkey = `${channelid}${userid}`;

        console.log(`Partitionkey: ${partitionkey}`);
        var query = new azure.TableQuery()
            .where('PartitionKey eq ?', partitionkey);

        tableSvc.queryEntities(tablename, query, null, function (e, r) {
            if (e)
                reject(e);
            else {
                for (var i = 0; i < r.entries.length; i++) {
                    var entry = r.entries[i];
                    session.send(entry.RowKey._);
                    tableSvc.deleteEntity(tablename, entry, function (e, r) { 
                        console.log(r);
                    });
                }
                resolve();
            }
        });
    });
}
