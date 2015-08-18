'use strict';

app.controller('addUser', ['$scope','Api', '$ionicPopup',function($scope,Api,$ionicPopup) {
	
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newuser = {};
	
	$scope.userSubmit = function() {
		console.log("newuser --> ",$scope.newuser);
		
		if(!$scope.newuser.username) {
			alert('Username required');
			return;
		}
		
		if(typeof $scope.newuser.image == 'undefined') {
			$scope.newuser.image = 'img/noavatar.png';
		}
		
		if(typeof $scope.newuser.lat == 'undefined'){
			$scope.newuser.lat = (-16.5411128+"");
			$scope.newuser.lng = (-68.088327+"");
		}
		
		/*$scope.newuser.lastLogin = 'Last login: never';
		$scope.newuser.id = $scope.users.length + 1;*/
		console.log("newuser --> ",$scope.newuser);
		Api.User.save({},$scope.newuser,
			function(data){
				//$scope.users.push($scope.newuser);
				//this.formScope.addUserForm.$setPristine();
				var defaultForm = {
					username : "",
					image : "",
					lat: "",
					lng: "",
					showlocation: false,
				};
				$scope.newuser = defaultForm;
				
			},
			function(err){
				$scope.showAlert("System Error!!!",err.statusText);
				return false;
			}
		)
	};
	
	$scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {});
	 };
	 
	 $scope.getLocation = function(){
	 	if($scope.newuser.showlocation == true){
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    }
	 	}
	}
	
	function showPosition(position) {
		$scope.newuser.lat = position.coords.latitude;
		$scope.newuser.lng = position.coords.longitude;
	    console.log("Latitude: ",$scope.newuser.lat);
	    console.log("Longitude: ",$scope.newuser.lng);
	}
	
}]);