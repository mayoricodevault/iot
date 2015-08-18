'use strict';

app.controller('editLocation', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService) {
	$scope.Locations = [];
	$scope.newlocation = shareComponentService.getDevice();
	console.log("new Location --> ",$scope.newlocation);
	$scope.formScope=null;
	$scope.setFormScope = function(frmLocation){
		$scope.formScope = frmLocation;
	}
	
	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
			$scope.showAlert("Incorrect Value !!","Invalid Name!");
			return;
		}
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		
		
		Api.Location.save({id:$scope.newlocation._id}, $scope.newlocation, 
        function(data){
			$scope.locations.push($scope.newlocation);
			$scope.formScope.addLocationForm.$setPristine();
			var defaultForm = {
				name : "",
				icon : "",
				note: "",
				featured: true,
			};
			$scope.newlocation = defaultForm;
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
