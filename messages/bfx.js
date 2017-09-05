const BFX = require('bitfinex-api-node')
var request = require("request");

const API_KEY = 'eQGimhGVCej4KJM6qqKrLDfaPhRITNxKg46gAZiVv8g'
const API_SECRET = 'Xk4JHVUTA7d0Btpdsu3cm2UkZbX4fXm7huGc2Af5tn8'
// hliXhEPaqndWNoRRjxZAW2w3pWOzmDnapp0xgAZyvkk 7FvVFs5KlsH8UdCewxzMUB2S6SvEnH1CPqyUfv6Hk7o
const opts = { version: 2, autoOpen: false }
//const bfx = new BFX(API_KEY, API_SECRET, opts).rest
var bfx;

var self = module.exports = {
    getBfx: function (s, forcenew) {
        if (!bfx || forcenew) {
            var apikey;
            var apisecret;

            if (s.userData.apikey) {
                apikey = s.userData.apikey;
                apisecret = s.userData.apisecret;
            }
            else {
                apikey = s.privateConversationData.apikey;
                apisecret = s.privateConversationData.apisecret;
            }

            bfx = new BFX(s.userData.apikey, s.userData.apisecret, opts).rest;
        }
        return bfx;
    },

    clearBfx: function () {
        bfx = null;
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
            self.getBfx(session).makePublicRequest('/ticker/' + coincode, function (err, resp) {
                if (err) reject(err);
                resolve(resp);
            });
        });
    },

    GetLatestPrice: function (coinelement, session) {
        return new Promise((resolve, reject) => {
            var coincode = 't' + coinelement;
            self.getBfx(session).makePublicRequest('/ticker/' + coincode, function (err, resp) {
                if (err) reject(err);
                resolve(resp);
            });
        });
    },

    GetSymbols: function (session) {
        return new Promise((resolve, reject) => {

            var options = { method: 'GET', url: 'https://api.bitfinex.com/v1/symbols' };

            request(options, function (error, response, body) {
                if (error) reject(err);

                var pairs = JSON.parse(body);
                var symbols = [];

                pairs.forEach(function (element) {
                    var s1 = element.substring(0, 3);
                    var s2 = element.substring(3, 3);

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
                if (error) reject(err);

                var pairs = JSON.parse(body);
                var markets = [];

                pairs.forEach(function (element) {
                    var s1 = element.substring(0, 3);
                    var s2 = element.substring(3, 6);

                    if(s1.toUpperCase() == symbol.toUpperCase())
                        markets.push(s2.toUpperCase());
                }, this);

                resolve(markets);
            });
        });
    }
}

