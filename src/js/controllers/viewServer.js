'use strict';

app.controller('viewServer', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService' ,'Toast','storeService', function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService,Toast,storeService) {
	$scope.servers = [];
	
	$scope.newserver = storeService.jsonRead("shareData");
	//$scope.newserver = shareComponentService.getDevice();
	
	
	 
}]);
