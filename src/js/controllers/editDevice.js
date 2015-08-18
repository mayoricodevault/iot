'use strict';

app.controller('editDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService) {
	
	$scope.newdevice = shareComponentService.getDevice();
	console.log("new device --> ",$scope.newdevice);
	$scope.formScope=null;
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	$scope.deviceSubmit = function() {
		if(!$scope.newdevice.devicename) {
			$scope.showAlert("Incorrect Value !!","Invalid Device Name!");
			return;
		}
		if(!$scope.newdevice.icon) {
			$scope.newdevice.icon = 'ion-alert';
		}
		if(!$scope.newdevice.tagid) {
			$scope.showAlert("Incorrect Value !!","Invalid Tag ID!");
			return;
		}
		
		Api.Device.save({id:$scope.newdevice._id}, $scope.newdevice, 
        function(data){
			$scope.devices.push($scope.newdevice);
			$scope.formScope.addDeviceForm.$setPristine();
			var defaultForm = {
				devicename : "",
				tagid:"",
				icon : "",
				status: "",
				type : "",
				devicelocation : "",
				masterDevice : "",
				featured : 0
			};
			$scope.newdevice = defaultForm;
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
