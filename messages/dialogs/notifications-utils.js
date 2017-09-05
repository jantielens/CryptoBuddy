var Guid = require('guid');
var documentClient = require("documentdb").DocumentClient;
var cosmosdbendpoint = process.env.cosmosdbendpoint;
var cosmosdbkey = process.env.cosmosdbkey;
var cosmosdburl = process.env.cosmosdburl;
var client = new documentClient(cosmosdbendpoint, { "masterKey": cosmosdbkey });


self = module.exports = {
    getBaseNotification: function (notificationtype, address) {
        //var notid = Guid.create().toString();
        var sub = {
            "type": "notification",
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
            var collectionUrl = `${cosmosdburl}/colls/default`;
            client.createDocument(collectionUrl, notification, {}, function (e) {
                if(e)
                    reject(e);
                else
                    resolve();
            });

        });
    },


}