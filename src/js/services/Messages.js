app.factory("Messages", ["$firebaseObject",
  function($firebaseObject) {
    return function(mesUrl) {
      var ref = new Firebase(mesUrl);
      return $firebaseObject(ref);
    };
  }
]);
