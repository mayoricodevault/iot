'use strict';

app.controller('messages', ['$scope', 'Api', '$ionicPopup','Toast' ,'MessagesService','$rootScope','SessionService','$http','API_URL',function($scope, Api, $ionicPopup, Toast,MessagesService,$rootScope,SessionService, $http,API_URL) {

	$scope.cleanMessages = MessagesService.getMessages();
    $scope.messages = [];
    
 	$scope.listCanSwipe = true;
    
    $scope.$watch('cleanMessages', function () {
        messagesToArray($scope.cleanMessages);
	}, true);
    
    function messagesToArray(oMessages) {
        var total = 0;
		$scope.messages = [];
		oMessages.forEach(function (message) {
			// Skip invalid entries so they don't break the entire app.
			if (!message || !message.expositor) {
				return;
			}
            $scope.messages.push(message);    
			total++;
		});
		$rootScope.totalMessages = total;
    }
    
    $scope.deleteMessage = function(){
        Toast.show("Delete Message...");
    }
    
	//$scope.people=$scope.visitors;
	$scope.doRefresh;
    
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
		$scope.cleanMessages = MessagesService.getMessages();
    }; //end doRefresh
    
}]);
