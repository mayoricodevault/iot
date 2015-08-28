'use strict';

app.controller('viewLocation', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService','Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService,Toast) {

	$scope.newlocation = [];
	$scope.Locations = [];
	$scope.locationsList=[
						{
							name:"ion-fork"
						},
						{
						   name:"ion-waterdrop"
						},{
							name:"ion-alert"
						}
		];	
	//$scope.newlocation = shareComponentService.getDevice();
	$scope.newlocation = storeService.jsonRead("shareData");
	 
}]);
