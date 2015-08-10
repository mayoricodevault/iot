'use strict';

app.controller('Intro', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup) {
	$scope.login = function() {
		$ionicLoading.show({
		  template: 'Logging in...'
		});
		$timeout( function() {
			$ionicLoading.show({
			  template: 'Success'
			});
		}, 1600);
		$timeout( function() {
			$ionicLoading.hide();
			$ionicSlideBoxDelegate.next();
		}, 2000);
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
});