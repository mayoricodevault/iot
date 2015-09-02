'use strict';

app.controller('addMessage', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast', function($scope, Api, $ionicPopup, $cordovaToast,Toast) {
    
    
    /*$scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefresh();
    });*/   
    
	//$scope.formScope=null;
	$scope.newmessage = {
		start:new moment()
	};
	
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	$scope.messageSubmit = function(message) {
		console.log("message --> ",message);
		console.log($scope.newmessage.start);
		console.log($scope.newmessage.end);
		
		$scope.newmessage.end = $scope.newmessage.start;
		
		if(typeof message=='undefined'||!message.text) {
			Toast.show("The field Text is required.");
			return;
		}
		if(!message.expositor) {
			Toast.show("The field Expositor is required.");
			return;
		}
		
		if(!message.start) {
			Toast.show("The field Start is required.");
			return;
		}
		
		if(!message.end){
			Toast.show("The field End is required.");
			return;
		}
		
		/*if(!$scope.newdevice.devicelocation) {
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
		
		console.log("newdevice --> ",$scope.newdevice);
		
		
		Api.Device.save({}, $scope.newdevice, 
        function(data){
			$scope.devices.push($scope.newdevice);
			$scope.formScope.addDeviceForm.$setPristine();
			$scope.doRefresh();
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
        });*/
        
	
	};

	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
	 
	 function doRefresh() {
	 	//$scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
	 }
	 
	 $scope.doRefresh = function() {
       // doRefresh();
    }
	 
}]);
