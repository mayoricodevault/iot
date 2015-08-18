'use strict';

app.controller('Intro', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup, UserFactory, Toast) {

	
	$scope.login = function(username, password) {
		Toast.show("Connecting....");
		UserFactory.login(username, password).
		then(function success(response){
			$scope.user = response.data;
			$timeout( function() {
				$ionicLoading.show({
				  template: 'Success'
				});
			}, 800);
			$timeout( function() {
				$ionicLoading.hide();
				$ionicSlideBoxDelegate.next();
			}, 800);
			
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