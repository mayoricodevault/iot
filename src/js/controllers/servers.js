'use strict';

app.controller('servers', ['$scope', 'Api', '$ionicPopup','Toast' , function($scope, Api, $ionicPopup, Toast) {

    $scope.form = {};
  	$scope.listCanSwipe = true;
	
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    });	
	
	
	$scope.doRefresh;

    $scope.delete = function(server){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this server: ' +server.name +"?"
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Server.delete({id: server._id}, function(data){
                $scope.doRefresh();
                $scope.refreshDataAmount();
            });
         } 
       });
    }
    
    
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Server.query({}, function(data){
             $scope.servers = data;
             $scope.refreshDataAmount();
        });
    }; //end doRefresh    
	 
}]);
