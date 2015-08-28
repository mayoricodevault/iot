'use strict';

app.controller('addDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast', function($scope, Api, $ionicPopup, $cordovaToast,Toast) {
    
    $scope.baristas=[];
    Api.Device.query({}, function(data){
    	for(var idx in data){
    		if(data[idx].type == 'Kiosk'){
    			$scope.baristas.push(data[idx]);
    		}
    	}
    	
    }); // devices query
    
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    }); // servers query
    
	$scope.newdevice = {};
	$scope.devicetypes=[
						{
							name:"Kiosk"
						},
						{
						   name:"Barista"
						},{
							name:"Dashboard"
						}
		];
		
    
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
		
		
		console.log("type: ",$scope.newdevice.type);
		if(!$scope.newdevice.type) {
			Toast.show("The field Type is required.");
			return;
		}
		
		if(!$scope.newdevice.master&&$scope.newdevice.type=='Kiosk') {
			Toast.show("The field Barista is required.");
			return;
		}
		
		if(!$scope.newdevice.server) {
			Toast.show("The field Server is required.");
			return;
		}
				
		
		Api.Device.save({}, $scope.newdevice, 
        function(data){
			$scope.devices.push($scope.newdevice);
			$scope.formScope.addDeviceForm.$setPristine();
			var defaultForm = {
				devicename : "",
				tagid:"",
				icon : "",
				status: "",
				master: "",
				server: "",
				devicelocation : "",
				type : "",
				featured : 0
			};
			$scope.newdevice = defaultForm;
    		
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
	 
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
            $scope.devices = data;
            $scope.refreshDataAmount();
        });
    }
	 
}]);
