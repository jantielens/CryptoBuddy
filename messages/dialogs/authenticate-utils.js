module.exports = {
    isAuthenticated: function (s) {
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

        if(apikey && apisecret)
            return true;
        else
            return false;
    }
}

