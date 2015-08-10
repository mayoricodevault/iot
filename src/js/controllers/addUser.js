'use strict';

app.controller('addUser', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newuser = {};
	$scope.userSubmit = function() {
		if(!$scope.newuser.username) {
			alert('Username required');
			return;
		}
		if(!$scope.newuser.avatar) {
			$scope.newuser.avatar = 'img/noavatar.png';
		}
		$scope.newuser.lastLogin = 'Last login: never';
		$scope.newuser.id = $scope.users.length + 1;
		$scope.users.push($scope.newuser);
		this.formScope.addUserForm.$setPristine();
		var defaultForm = {
			id : "",
			username : "",
			avatar : "",
			location: false
		};
		$scope.newuser = defaultForm;
	};
});