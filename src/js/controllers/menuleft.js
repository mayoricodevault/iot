'use strict';

app.controller('menuleft', ['$scope','$rootScope', function($scope,$rootScope) {
    $scope.role = ($rootScope.userRole == "admin")?true:false;
}]);
