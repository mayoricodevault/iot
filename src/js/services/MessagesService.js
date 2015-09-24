app.factory('MessagesService', ['$firebaseObject', 'FIREBASE_MESSAGES', function ($firebaseObject, FIREBASE_MESSAGES) {
    var ref = new Firebase(FIREBASE_MESSAGES);
    var messages = $firebaseObject(ref);
    var getMessages = function () {
        return messages;
    };

    var update = function (id, newMsg) {
        var syncObject =  $firebaseObject(ref.child(id));
        syncObject.$loaded().then(function() {
            if (syncObject.id) {
                syncObject.text = newMsg.text;
                syncObject.expositor = newMsg.expositor;
                syncObject.start = newMsg.start;
                 syncObject.end = newMsg.end;
                syncObject.$save();
            }
        });

    };

    return {
        getMessages: getMessages,
        update : update
    };
}]);