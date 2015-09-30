'use strict';

app.controller('menuleft', ['$scope','$rootScope','LSFactory', function($scope,$rootScope,LSFactory) {
    var userrole = LSFactory.getUser();
    $scope.role = (userrole == "admin")?true:false;
}]);
