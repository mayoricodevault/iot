app.factory('SessionService', ['$firebaseObject', 'FIREBASE_URI_SESSIONS', 'FIREBASE_URI_ROOT','LSFactory',function ($firebaseObject, FIREBASE_URI_SESSIONS, FIREBASE_URI_ROOT, LSFactory) {
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
    
    var updateSessionStatus = function (socketid, ts, isdeleted) {
        var syncObject =  $firebaseObject(ref.child(socketid));
        syncObject.$loaded().then(function() {
            if (syncObject.deviceName) {
                syncObject.ping_dt = ts;
                syncObject.isdeleted = isdeleted;
                syncObject.$save();
            }
        });

    };
    
    return {
        getSessions: getSessions,
        removeSession : removeSession,
        updateSessionStatus:updateSessionStatus
    };
}]);