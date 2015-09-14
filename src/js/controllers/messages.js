'use strict';

app.controller('messages', ['$scope', 'Api', '$ionicPopup','Toast' ,'Messages','$rootScope','SessionService','$http','API_URL','storeService','$state','FIREBASE_MESSAGES',function($scope, Api, $ionicPopup, Toast,Messages,$rootScope,SessionService, $http,API_URL,storeService,$state, FIREBASE_MESSAGES) {
	$scope.listCanSwipe = true;
	$scope.cleanMessages=[];
    $scope.messages = [];
    $scope.showDelete=false;
    Messages(FIREBASE_MESSAGES).$bindTo($scope, "fbMBind");
    $scope.$watch('fbMBind', function() {
        doRefreshAll();
    });   
    $scope.$on('$ionicView.beforeEnter', function () {
        doRefreshAll();
    });   
    $scope.deleteMessage = function(message){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Delete this Message ' +message.expositor +'?'
       });
       confirmPopup.then(function(res) {
         if(res) {
         	var syncObject = Messages(FIREBASE_MESSAGES+'/'+message.id);
	         syncObject.$loaded().then(function() {
	                syncObject.$remove();
	        });
         } 
       });
    };
    
    $scope.quickDeleteMessage = function(message){
     	var syncObject = Messages(FIREBASE_MESSAGES+'/'+message.id);
         syncObject.$loaded().then(function() {
                syncObject.$remove();
        });
    };
    $scope.messageTap = function(route, message) {
		$scope.message = message;
		storeService.jsonWrite('shareData',message);
		$state.go(route);
	};
	$scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        doRefreshAll();
    }; //end doRefresh
    function doRefreshAll() {
    	var total = 0;
		$scope.messages = [];
		angular.forEach($scope.fbMBind, function(message, key){
			if (!message || !message.expositor) {
				return;
			}
			message.id = key;
           $scope.messages.push(message);    
			total++;
		});
		$rootScope.totalMessages = total;
    }
    
    
}]);