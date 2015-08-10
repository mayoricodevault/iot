'use strict';

app.controller('addLocation', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newlocation = {};
	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		$scope.locations.push($scope.newlocation);
		this.formScope.addLocationForm.$setPristine();
		var defaultForm = {
			name : "",
			icon : "",
			note : ""
		};
		$scope.newlocation = defaultForm;
	};
});