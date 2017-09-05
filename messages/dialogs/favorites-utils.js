module.exports = {
    userFavorites: function (session) {
        if (!session.userData.favorites)
            session.userData.favorites = [];
        return session.userData.favorites;
    },

    replaceFavorites: function (session, newfavs) {
        session.userData.favorites = newfavs;
    }
}

