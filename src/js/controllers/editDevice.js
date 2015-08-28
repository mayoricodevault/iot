'use strict';

app.controller('editDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService', 'Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService, Toast) {
	
	
	$scope.newdevice = storeService.jsonRead("shareData");
	$scope.newdevice=[];
	$scope.locationsList=[];
	$scope.typeList=[];
	$scope.deviceList=[];
	
	
	Api.Device.query({}, function(data){
		$scope.deviceList=data;
		console.info("DEVICES LIST "+$scope.deviceList);
    }); // end query device	
	
	Api.Location.query({}, function(data){
		for(var key in data){
			console.log("sadfasdfasdf");
			if($scope.deviceList.devicelocation == data[key]._id){
				$scope.newdevice.devicelocation = $scope.locations.name;
				console.log("DEVICE LOCATION: ",$scope.newdevice.devicelocation);
				break;
			}
		}
    	$scope.locationsList=data;
    }); // end query locations
    
    
	$scope.typeList=[{
							name:"Kiosk"
						},
						{
						   name:"Barista"
						},{
							name:"Dashboard"
						}];    
					
					
    
   // $scope.newdevice=[]; 
	$scope.newdevice = storeService.jsonRead("shareData");
	$scope.formScope=null;
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	$scope.deviceSubmit = function() {
		if(!$scope.newdevice.devicename) {
			Toast.show("The field Name is required.");
			return;
		}
		if(!$scope.newdevice.icon) {
			$scope.newdevice.icon = 'ion-alert';
		}
		if(!$scope.newdevice.tagid) {
				Toast.show("The field Tag ID is required.");
			return;
		}
		
		if(!$scope.newdevice.devicelocation) {
			Toast.show("The field Location is required.");
			return;
		}		
		
		Api.Device.save({id:$scope.newdevice._id}, $scope.newdevice, 
        function(data){
			//$scope.devices.push($scope.newdevice);
			//$scope.formScope.addDeviceForm.$setPristine();
			storeService.jsonWrite("shareData",$scope.newdevice);
			Toast.show("Update Successful.");
			//$scope.doRefresh();
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
	 
	 /*$scope.doRefresh = function() {
        Toast.show('Loading...');
     }*/
}]);
