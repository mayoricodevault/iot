'use strict';

app.controller('editDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService', 'Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService, Toast) {
	
	
	$scope.newdevice = storeService.jsonRead("shareData");
	$scope.newdevice=[];
	$scope.locationsList=[];
	$scope.typeList=[];
	$scope.deviceList=[];
	Api.Location.query({}, function(data){
    	$scope.locationsList=data;
    }); // end query locations
    
    
	$scope.typeList=[{
						name:"Generic"
					},{
					    name:"Slave"
					}];    
					
	Api.Device.query({}, function(data){
    	$scope.deviceList=data;
    	console.info("DEVICES LUST "+$scope.deviceList);
    }); // end query device					
					
    
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
		
		if(!$scope.newdevice.type){
		  Toast.show("The field Type is required.");
			return;
		}		
		
		if(angular.lowercase($scope.newdevice.type)==="slave"){
			if(!$scope.newdevice.masterdevice){
		  		Toast.show("The field Master device is required.");
				return;
			}
		}		
		
		
		if(angular.lowercase($scope.newdevice.type)==="generic"){
			$scope.newdevice.masterdevice="";
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
