'use strict';

app.controller('addDevice', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newdevice = {};
	$scope.deviceSubmit = function() {
		if(!$scope.newdevice.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newdevice.icon) {
			$scope.newdevice.icon = 'ion-alert';
		}
		$scope.newdevice.id = $scope.devices.length + 2;
		$scope.devices.push($scope.newdevice);
		this.formScope.addDeviceForm.$setPristine();
		var defaultForm = {
			id : "",
			name : "",
			icon : "",
			status: "",
			color: "",
			userSelect : "",
			actionSelect : "",
			locationSelect : ""
		};
		$scope.newdevice = defaultForm;
	};
});