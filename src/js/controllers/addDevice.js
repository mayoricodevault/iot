'use strict';

app.controller('addDevice', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast', function($scope, Api, $ionicPopup, $cordovaToast,Toast) {
    
    $scope.baristas=[];
    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefresh();
    });   
    
    function baristaFilter(data){
    	$scope.baristas=[];
    	for(var idx in data){
    		if(data[idx].type == 'Barista'){
    			$scope.baristas.push(data[idx]);
    		}
    	}
    }
    
    Api.Device.query({}, function(data){
    	$scope.devices = data;
    	baristaFilter(data);
    }); // devices query
    
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    }); // servers query
    
	$scope.newdevice = {};
	$scope.devicetypes=[{name:"Kiosk"},
						{name:"Barista"},
						{name:"Dashboard"},
						{name:"Welcome"}
		];
		
	$scope.imageList=[
			{name:"Dashboard",src:"img/dashboard.jpg"},
			{name:"Kiosk",src:"img/kiosk.jpg"},
			{name:"Barista",src:"img/barista.png"},
			{name:"Welcome",src:"img/welcome.png"}
		];
		
	$scope.formScope=null;
	
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	function tagidExist(tagid){
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
			$scope.newdevice.icon = "img/kiosk.jpg";
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
	
		
		if(typeof $scope.newdevice.master == 'undefined'){
			$scope.newdevice.master = 0;
		}
		
		console.log($scope.newdevice);
		
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
	 
	 
	 function doRefresh() {
	 	$scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
            $scope.devices = data;
            baristaFilter(data);
            $scope.refreshDataAmount();
        });
	 }
	 
	 $scope.doRefresh = function() {
        doRefresh();
    }
	 
}]);
