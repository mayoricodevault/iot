app.factory('SessionService', ['$firebaseObject', 'FIREBASE_URI_SESSIONS', function ($firebaseObject, FIREBASE_URI_SESSIONS) {
    var ref = new Firebase(FIREBASE_URI_SESSIONS);
    var activeSessions = $firebaseObject(ref);
    var getSessions = function () {
        return activeSessions;
    };

    return {
        getSessions: getSessions
    };
}]);