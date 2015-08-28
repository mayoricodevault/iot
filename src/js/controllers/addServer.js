'use strict';
//app.controller('addLocation',['$scope','Api','$ionicPopup','$cordovaToast','shareDeviceService', function($scope,Api,$ionicPopup,$cordovaToast,shareDeviceService) {
app.controller('addServer',['$scope','Api','$ionicPopup','$cordovaToast','Toast', function($scope,Api,$ionicPopup,$cordovaToast,Toast) {

	$scope.newserver = {
		name : "",
		ipaddress : "",
		url : ""
	};
	
	$scope.formScope=null;
	$scope.setFormScope = function(frmServer){
		this.formScope = frmServer;
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
		
		Api.Server.save({},$scope.newserver,
			function(data){
				$scope.servers.push($scope.newserver);
				
				var defaultForm = {
					name : "",
					ipaddress : "",
					url : ""
				};
				$scope.newserver = defaultForm;			
			},
		function(err){
			$scope.showAlert("System Error!!!",err.statusText);
			return false;
		});
	}; // end submit
	
	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };// end showAlert
	
	
	
	$scope.validateUrl=function (value){
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    };
	
	
}]);