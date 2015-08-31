app.factory('SessionService', ['$firebaseObject', 'FIREBASE_URI_SESSIONS', 'FIREBASE_URI_ROOT', function ($firebaseObject, FIREBASE_URI_SESSIONS, FIREBASE_URI_ROOT) {
    var ref = new Firebase(FIREBASE_URI_SESSIONS);
    var activeSessions = $firebaseObject(ref);
    var getSessions = function () {
        return activeSessions;
    };

    var removeSession = function (socketid){
        var session_url = FIREBASE_URI_ROOT + '/sessions/' + socketid;
        var refSession = new Firebase(session_url);
        var syncObject = $firebaseObject(refSession);
         syncObject.$loaded().then(function() {
                syncObject.$remove();
        });
    };
    return {
        getSessions: getSessions,
        removeSession : removeSession
    };
}]);