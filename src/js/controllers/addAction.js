'use strict';

app.controller('addAction', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newaction = {};
	$scope.newaction.type = 'range';
	$scope.newaction.state = 'on';
	$scope.actionSubmit = function() {
		if(!$scope.newaction.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newaction.iconBefore) {
			$scope.newaction.iconBefore = 'ion-ios7-minus-empty';
		}
		if(!$scope.newaction.iconAfter) {
			$scope.newaction.iconAfter = 'ion-ios7-plus-empty';
		}
		if(!$scope.newaction.units) {
			$scope.newaction.units = 'units';
		}
		if(!$scope.newaction.minValue) {
			$scope.newaction.minValue = '0';
		}
		if(!$scope.newaction.maxValue) {
			$scope.newaction.maxValue = '100';
		}
		$scope.actions.push($scope.newaction);
		this.formScope.addActionForm.$setPristine();
		var defaultForm = {
			name : "",
			value : "",
			state: "",
			minValue : "",
			maxValue : "",
			units : "",
			iconBefore : "",
			iconAfter : "",
			deviceSelect : "",
			script : "",
			featured : ""
		};
		$scope.newaction = defaultForm;
	};
});