const BFX = require('bitfinex-api-node')
var request = require("request");

const opts = { version: 2, autoOpen: false }

var self = module.exports = {
    getBfx: function (session) {
        var apikey;
        var apisecret;

        if (session.userData.apikey) {
            apikey = session.userData.apikey;
            apisecret = session.userData.apisecret;
        }
        else {
            apikey = session.privateConversationData.apikey;
            apisecret = session.privateConversationData.apisecret;
        }
        var bfx = new BFX(apikey, apisecret, opts).rest;
        return bfx;

    },

    GetWallets: function (session) {
        return new Promise((resolve, reject) => {
            self.getBfx(session).makeAuthRequest('/auth/r/wallets', {}, function (err, body) {
                if (err) reject(err);
                resolve(body);
            });
        });
    },

    GetLatestPriceForElement: function (coinelement, session) {
        return new Promise((resolve, reject) => {
            var coincode = 't' + coinelement[1] + 'USD';
            var options = { method: 'GET', url: 'https://api.bitfinex.com/v2/ticker/' + coincode };

            request(options, function (error, response, body) {
                if(error) reject(error);
                resolve(JSON.parse(body));
            });
            
            // self.getBfx(session).makePublicRequest('/ticker/' + coincode, function (err, resp) {
            //     if (err) reject(err);
            //     resolve(resp);
            // });
        });
    },

    GetLatestPrice: function (coinelement, session) {
        return new Promise((resolve, reject) => {
            var coincode = 't' + coinelement;
            var options = { method: 'GET', url: 'https://api.bitfinex.com/v2/ticker/' + coincode };

            request(options, function (error, response, body) {
                if(error) reject(error);
                resolve(JSON.parse(body));
            });

            // self.getBfx(session).makePublicRequest('/ticker/' + coincode, function (err, resp) {
            //     if (err) reject(err);
            //     resolve(resp);
            // });
        });
    },

    GetSymbols: function () {
        return new Promise((resolve, reject) => {

            var options = { method: 'GET', url: 'https://api.bitfinex.com/v1/symbols' };

            request(options, function (error, response, body) {
                if (error) reject(error);

                var pairs = JSON.parse(body);
                var symbols = [];

                pairs.forEach(function (element) {
                    var s1 = element.substring(0, 3);
                    //var s2 = element.substring(3, 3);

                    var i = symbols.indexOf(s1.toUpperCase());
                    if (i == -1) {
                        symbols.push(s1.toUpperCase());
                    }
                }, this);

                resolve(symbols);
            });
        });
    },

    GetMarkets: function (session, symbol) {
        return new Promise((resolve, reject) => {

            var options = { method: 'GET', url: 'https://api.bitfinex.com/v1/symbols' };

            request(options, function (error, response, body) {
                if (error) reject(error);

                var pairs = JSON.parse(body);
                var markets = [];

                pairs.forEach(function (element) {
                    var s1 = element.substring(0, 3);
                    var s2 = element.substring(3, 6);

                    if (s1.toUpperCase() == symbol.toUpperCase())
                        markets.push(s2.toUpperCase());
                }, this);

                resolve(markets);
            });
        });
    }
}

