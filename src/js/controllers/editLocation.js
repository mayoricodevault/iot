'use strict';

app.controller('editLocation', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService','Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService,Toast) {

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
	
	$scope.formScope=null;
	$scope.setFormScope = function(frmLocation){
		$scope.formScope = frmLocation;
	}
	
	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
			Toast.show("The field Name is required.");
			return;
		}
		
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		
		Api.Location.save({id:$scope.newlocation._id}, $scope.newlocation, 
        function(data){
			Toast.show("Update Successful.","");
			storeService.jsonWrite("shareData",$scope.newlocation);
        },
        function(err){
        	$scope.showAlert("System Error!!!", err.statusText);
			return false;
        });
	
	};

	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
}]);
