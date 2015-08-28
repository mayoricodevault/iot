'use strict';

app.controller('viewPerson', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService','Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService,Toast) {

	$scope.new_person = [];
	$scope.people = [];
	//$scope.newlocation = shareComponentService.getDevice();
	$scope.new_person = storeService.jsonRead("shareData");
/*
	 for(var k in $scope.new_person) {
   		console.log(k, $scope.new_person[k]);
	 }
*/	 
}]);