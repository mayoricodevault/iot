'use strict';

app.controller('editDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService','storeService', 'Toast' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService, storeService, Toast) {
	
	
	$scope.newdevice = storeService.jsonRead("shareData");
	$scope.newdevice=[];
	$scope.locationsList=[];
	$scope.typeList=[];
	$scope.deviceList=[];
	$scope.baristas=[];
	
	function baristaFilter(data){
    	$scope.baristas=[];
    	for(var idx in data){
    		if(data[idx].type == 'Barista'){
    			$scope.baristas.push(data[idx]);
    		}
    	}
    }
	
	Api.Device.query({}, function(data){
		$scope.deviceList=data;
		baristaFilter(data);
    }); // end query device	
    
    Api.Location.query({},function(data){
    	$scope.locationsList = data;
    });
	
    
	$scope.typeList=[   {name:"Kiosk"},
						{name:"Barista"},
						{name:"Dashboard"},
						{name:"Welcome"}
				];    
					
	$scope.newdevice = storeService.jsonRead("shareData");
	$scope.formScope=null;
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	function tagidExist(tagid){
		var device = storeService.jsonRead("shareData"); //review if is the same tagid
		
		if(device.tagid == tagid)return false;
		
		for(var key in $scope.devices){
			if($scope.devices[key].tagid==tagid) return true;
		}
		
		return false;
	}
	
	function getMasterUrl(masterName){
		for(var key in $scope.devices){
			if($scope.devices[key].devicename == masterName)
				return $scope.devices[key].serverUrl;
		}
		return "";
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
		if(tagidExist($scope.newdevice.tagid)){
			Toast.show("The field Tag ID exist.");
			return;
		}
		if(!$scope.newdevice.devicelocation) {
			Toast.show("The field Location is required.");
			return;
		}
		if(!$scope.newdevice.type) {
			Toast.show("The field Type is required.");
			return;
		}
		
		if(!$scope.newdevice.master&&$scope.newdevice.type=='Kiosk') {
			Toast.show("The field Barista is required.");
			return;
		}
		
		$scope.newdevice.masterUrl = getMasterUrl($scope.newdevice.master);
		
		if(!$scope.newdevice.server) {
			Toast.show("The field Server is required.");
			return;
		}
		
		$scope.newdevice.serverUrl = "";
		$scope.newdevice.serverId = "";
		
		for(var key in $scope.servers){
			if($scope.servers[key].name==$scope.newdevice.server){
				$scope.newdevice.serverUrl = $scope.servers[key].url;
				$scope.newdevice.serverId = $scope.servers[key]._id;
				break;
			}
		}
		
		 Api.Device.save({id:$scope.newdevice._id}, $scope.newdevice, 
	        function(data){
		 		storeService.jsonWrite("shareData",$scope.newdevice);
		 		Toast.show("Update Successful.");

	        },
	        function(err){
	        	Toast.show("System Error!!!", err.statusText);
		 		return false;
	        }
	    );
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
