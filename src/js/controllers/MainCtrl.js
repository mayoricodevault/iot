'use strict';

app.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {
	$scope.users = [
		{ username: 'Admin', email: 'admin@iot.domain', location: true, id: 'admin', avatar: 'img/noavatar.png', enabled: 'true', lastLogin: 'Online' },
		{ username: 'xively', email: 'xively@iot.domain', location: true, id: 'xively', avatar: 'img/noavatar.png', enabled: 'true', lastLogin: 'Last login: 01/09/2014' }
	];
	$scope.device = { id: null, name: 'No Device', icon: 'ion-ios7-help-empty', status: 'Offline' },
	$scope.devices = [
		{ id: '1', name: 'Hall Way 1', icon: 'ion-thermometer', status: 'Off Line', featured: true, userSelect: "xively", actionSelect: "1" },
		{ id: '2', name: 'Hall Way 2', icon: 'ion-coffee', status: 'Inactive', color: 'balanced', featured: true, userSelect: "xively", actionSelect: "1" },
		{ id: '3', name: 'Hall Way 3', icon: 'ion-no-smoking', status: 'Idle', color: 'assertive', featured: true, userSelect: "xively", actionSelect: "1" },
		{ id: '4', name: 'Welcome', icon: 'ion-model-s', status: 'Online', featured: true, userSelect: "xively", actionSelect: "1" },
		{ id: '5', name: 'Barista - Guest', icon: 'ion-locked', status: 'Unarmed', color: 'assertive', featured: true, userSelect: "xively", actionSelect: "1"},
		{ id: '6', name: 'Barista - Open', icon: 'ion-load-b', status: 'Working', color: 'balanced', userSelect: "xively", actionSelect: null },
		{ id: '7', name: 'DashBoard', icon: 'ion-social-windows', status: 'Online', color: 'balanced', featured: true, userSelect: "admin", actionSelect: null },
		{ id: '8', name: 'Satellite Station', icon: 'ion-social-apple', status: 'Online', color: 'balanced', userSelect: "xively", actionSelect: null },
		{ id: '9', name: 'Client Face', icon: 'ion-social-tux', status: 'Online', color: 'balanced', userSelect: "xively", actionSelect: null },
	];
	$scope.locations = [
		{ id: '1', name: 'Hallway', icon: 'ion-fork', note: 'Hall Way', featured: true },
		{ id: '2', name: 'Contitution', icon: 'ion-waterdrop', note: 'Coffe Shop Setup', featured: true },
	];
	$scope.actions = [
		{ id: '1', name: 'In Zone', type: "range", value: '68', minValue : "0", maxValue : "100", units: "%", iconBefore: 'ion-ios7-lightbulb-outline', iconAfter: 'ion-ios7-lightbulb', deviceSelect : "", script: "", featured: true },
		{ id: '2', name: 'Out Zone', type: "range", value: '24', minValue : "0", maxValue : "100", units: "%", iconBefore: 'ion-ios7-bolt-outline', iconAfter: 'ion-ios7-bolt', deviceSelect : "", script: "", featured: false },
		{ id: '4', name: 'Replication', type: "toggle", featured: true },
	];
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.deviceTap = function(route, device) {
		$scope.device = device;
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
})