'use strict';
//app.controller('addLocation',['$scope','Api','$ionicPopup','$cordovaToast','shareDeviceService', function($scope,Api,$ionicPopup,$cordovaToast,shareDeviceService) {
app.controller('addLocation',['$scope','Api','$ionicPopup','$cordovaToast', function($scope,Api,$ionicPopup,$cordovaToast) {

	$scope.locationsList=[
						{ name:"ion-fork"},
						{ name:"ion-waterdrop"},
						{name:"ion-alert"}];
		
	$scope.newlocation = {
		name : "",
		icon : "",
		note : "",
		featured : true
	};
	$scope.formScope=null;
	$scope.setFormScope = function(frmLocation){
		this.formScope = frmLocation;
	}
	
	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
			$scope.showAlert("Name required.","Name is empty.");
			return;
		}
		
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		
		
		Api.Location.save({},$scope.newlocation,
			function(data){
				$scope.locations.push($scope.newlocation);
				
				var defaultForm = {
					name : "",
					icon : "",
					note : "",
					featured : true
				};
				$scope.newlocation = defaultForm;			
			},
		function(err){
			$scope.showAlert("System Error!!!",err.statusText);
			return false;
		});
	}; // end submit
	
	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };// end showAlert
	
}]);