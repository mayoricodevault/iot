'use strict';

app.controller('Intro', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup) {
	
	var firebaseObj;
	
	$scope.SignIn = function(event) {
        event.preventDefault();  // To prevent form refresh

        // Auth Logic will be here
        firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
        var loginObj = $firebaseSimpleLogin(firebaseObj);

        var username = $scope.user.email;
        var password = $scope.user.password;

        loginObj.$login('password', {
            email: username,
            password: password
        })
            .then(function(user) {
                // Success callback
                console.log('Authentication successful');
            }, function(error) {
                // Failure callback
                console.log('Authentication failure');
        });
    }
    
    $scope.Logout = function(){
    	firebaseObj.logout();
    }
    
	
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