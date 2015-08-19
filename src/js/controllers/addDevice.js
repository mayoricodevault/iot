'use strict';

app.controller('addDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast', function($scope, Api, $ionicPopup, $cordovaToast,Toast) {
	
	Api.Location.query({}, function(data){
    	$scope.locations=data;
    }); // end query locations
    
    $scope.typeList=[];
	$scope.typeList=[{
						name:"Generic"
					},{
					    name:"Slave"
					}];    
    
    $scope.deviceList=[];
    
    /*
    Api.Device.query({type:"Generic"}, function(data){
    	$scope.deviceList=data;
    }); // end query device	
    */
	Api.Device.query({}, function(data){
		$scope.deviceList=data;
	}); // end query device	    
    
	$scope.newdevice = {};
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
		
		/*
		if(angular.lowercase($scope.newdevice.type)==="slave"){
			if(!$scope.newdevice.masterdevice){
		  		Toast.show("The field Master device is required.");
				return;
			}
		}*/
		
		if(angular.lowercase($scope.newdevice.type)==="generic"){
			console.info("*** device is generic ***");
			$scope.newdevice.masterdevice="";
		}
		
		if($scope.newdevice.masterdevice==='undefined'){
			$scope.newdevice.masterdevice="";
		}
		
		console.info("SAVE SAVE "+$scope.newdevice.masterdevice);
		Api.Device.save({}, $scope.newdevice, 
        function(data){
		//	$scope.devices.push($scope.newdevice);
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
			
			Api.Device.query({}, function(data){
    			$scope.deviceList=data;
    		}); // end query device	
    		
			Toast.show("Add Successful.");
        },
        function(err){
        	Toast.show(err.data);
        	//$scope.showAlert("System Error!!!", err.statusText);
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
