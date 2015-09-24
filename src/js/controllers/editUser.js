'use strict';

app.controller('editUser', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','storeService','Toast' , function($scope, Api, $ionicPopup, $cordovaToast, storeService, Toast) {
	$scope.users = [];
	$scope.newuser = storeService.jsonRead("shareData");
	
	$scope.formScope=null;
	$scope.setFormScope = function(frmUser){
		$scope.formScope = frmUser;
	}
	
	$scope.userSubmit = function() {
		if(!$scope.newuser.username) {
			Toast.show('The field Username is required');
			return;
		}
		
		if(!$scope.newuser.password) {
			Toast.show('The field Password is required');
			return;
		}
		
		console.log("avatar --> ",$scope.newuser.image);
		if(typeof $scope.newuser.image == 'undefined'||$scope.newuser.image.length == 0) {
			$scope.newuser.image = 'img/noavatar.png';
		}
		
		if(typeof $scope.newuser.lat == 'undefined'){
			$scope.newuser.lat = (-16.5411128+"");
			$scope.newuser.lng = (-68.088327+"");
		}
		
		Api.User.save({id:$scope.newuser._id},$scope.newuser,
			function(data){
				$scope.users.push($scope.newuser);
				storeService.jsonWrite("shareData",$scope.newuser);
				Toast.show("Add Successful.");
			},
			function(err){
				Toast.show(err.data);
				return false;
			}
		)
	};

}]);
