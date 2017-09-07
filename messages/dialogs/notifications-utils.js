var documentClient = require("documentdb").DocumentClient;
var cosmosdbendpoint = process.env.cosmosdbendpoint;
var cosmosdbkey = process.env.cosmosdbkey;
var cosmosdburl = process.env.cosmosdburl;
var cosmosdbcollection = process.env.cosmosdbcollection;
var collectionUrl = cosmosdburl + '/colls/' + cosmosdbcollection;

var client = new documentClient(cosmosdbendpoint, { "masterKey": cosmosdbkey });


self = module.exports = {
    getBaseNotification: function (notificationtype, address) {
        //var notid = Guid.create().toString();
        var sub = {
            "type": "notification",
            "environment": process.env.environment,
            "notificationtype": notificationtype,
            "isactive": true,
            "channelid": address.channelId,
            "fromid": address.bot.id,
            "fromname": address.bot.name,
            "toid": address.user.id,
            "toname": address.user.name,
            "serviceurl": address.serviceUrl
        };

        return sub;
    },

    createNotification: function (notification) {
        return new Promise((resolve, reject) => {
            var collectionUrl = `${cosmosdburl}/colls/${cosmosdbcollection}`;
            client.createDocument(collectionUrl, notification, {}, function (e) {
                if (e)
                    reject(e);
                else
                    resolve();
            });

        });
    },

    retrieveNotifications: function (channelid, userid) {
        return new Promise((resolve, reject) => {
            client.queryDocuments(
                collectionUrl,
                `SELECT * FROM c WHERE c.type = "notification" AND c.environment = "${process.env.environment}" AND c.channelid="${channelid}" AND c.toid ="${userid}"`
            ).toArray((err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    },
    deleteNotifications: function (doclink) {
        return new Promise((resolve, reject) => {
            client.deleteDocument(doclink, function (e, r) {
                if (e) reject('Can\'t delete notification: ' + e);
                resolve();
            });
        });
    }
}