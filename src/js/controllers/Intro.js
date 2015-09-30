'use strict';

app.controller('Intro', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup, UserFactory, Toast , Socket, $rootScope, $state, LSFactory) {
	$scope.ioConn = null;
	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
	 };
        
	$scope.login = function(username, password) {
		Toast.show("Connecting....", 30);
		UserFactory.login(username, password).
		then(function success(response){
			console.log(response.data.role);
			$rootScope.userRole = response.data.role;
			$timeout( function() {
				$ionicLoading.show({
				  template: 'Success'
				});
			}, 800);
			$timeout( function() {
				$ionicLoading.hide();
			}, 800);
			$scope.ioConn = Socket.connect();
			LSFactory.setData("sio", $scope.ioConn.id);
			LSFactory.setData("userId", username);
			//var role={'role':response.data.role};
			if(response.data.role=="admin"){
				$state.go("router.dashboard.home");
			}else{
				$state.go("router.messages");
			}
		}, loginError);
		
	}
	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	}
	$scope.prevSlide = function() {
		$ionicSlideBoxDelegate.previous();
	}
	$scope.showRegister = function() {
		$scope.data = {}
		var myPopup = $ionicPopup.show({
			template: '<input type="email" ng-model="data.email">',
			title: 'Enter Your Email Address',
			subTitle: 'You will be notified once approved',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
				 text: '<b>Submit</b>',
				 type: 'button-balanced',
				 onTap: function(e) {
				   if (!$scope.data.email) {
					 e.preventDefault();
				   } else {
					 return $scope.data.email;
				   }
				 }
				},
			]
		});
	};
	function loginError(response) {
		$ionicSlideBoxDelegate.previous();
		Toast.show(response.data,1200);
	}
});