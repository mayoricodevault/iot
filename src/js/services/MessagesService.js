app.factory('MessagesService', ['$firebaseObject', 'FIREBASE_MESSAGES', function ($firebaseObject, FIREBASE_MESSAGES) {
    var ref = new Firebase(FIREBASE_MESSAGES);
    var messages = $firebaseObject(ref);
    var getMessages = function () {
        return messages;
    };

    return {
        getMessages: getMessages
    };
}]);