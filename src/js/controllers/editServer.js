'use strict';

app.controller('editServer', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService' ,'Toast','storeService', function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService,Toast,storeService) {
	$scope.servers = [];
	
	
	
	
	$scope.newserver = storeService.jsonRead("shareData");
	//$scope.newserver = shareComponentService.getDevice();
	
	$scope.formScope=null;
	$scope.setFormScope = function(frmServer){
		$scope.formScope = frmServer;
	}
	
	$scope.serverSubmit = function() {
		if(!$scope.newserver.name) {
		    Toast.show("The field Name is required.");
			return;
		}
		
		if(!$scope.newserver.ipaddress) {
		    Toast.show("The field Ip Address is required.");
			return;
		}		
		
		if(!$scope.newserver.url) {
		    Toast.show("The field Url is required.");
			return;
		}		
		
		if(!$scope.validateUrl($scope.newserver.url)){
			Toast.show("The value Url is invalid.");
			return;
		}
		
		Api.Server.save({id:$scope.newserver._id}, $scope.newserver, 
        function(data){
			Toast.show("Update Successful.");
			storeService.jsonWrite("shareData",$scope.newserver);
			//$scope.newserver = shareComponentService.getDevice();
			shareComponentService.addDevice($scope.newserver);
        },
        function(err){
        	Toast.show("System Error." + err.statusText);
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
	 
	$scope.validateUrl=function (value){
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    };	 
	 
}]);
