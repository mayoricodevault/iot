'use strict';

app.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, shareComponentService, UserFactory, storeService, $rootScope, Socket, $ionicHistory, $ionicSlideBoxDelegate, $window, API_URL, Toast, LSFactory) {
	$scope.username="";
	$scope.password="";

	$scope.type = [
		{id:'1',name:'Generic'},
		{id:'2',name:'Slave'}
	];

	
	UserFactory.getUser().then(function success(response){
		$rootScope.user = response.data;	
	});
	
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.deviceTap = function(route, device) {
		$scope.device = device;
		shareComponentService.addDevice(device);
		
		storeService.jsonWrite("shareData",device);
		
		$state.go(route);
	};
	
	$ionicPopover.fromTemplateUrl('templates/alerts.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openAlerts = function($event) {
		$scope.popover.show($event);
	};
	$scope.closeAlerts = function() {
		$scope.popover.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	$timeout(function () {
		ionic.EventController.trigger("resize", "", true, false);
	}, 1500);
	
	$scope.logout = function() {
		$scope.username="";
		$scope.password="";
		UserFactory.logout();
		LSFactory.setData("sio");
		LSFactory.setData("userId");
		$rootScope.user = null;
		$rootScope.socketidSession = null;
		Socket.disconnect(true);
		$ionicHistory.clearHistory();
		// $state.go('intro', {}, { reload: true });
		Toast.show('Restarting....');
		$window.location.href = API_URL;
	}
})