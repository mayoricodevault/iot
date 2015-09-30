'use strict';

app.controller('MainCtrl', function(Api, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, shareComponentService, UserFactory, storeService, $rootScope, Socket, $ionicHistory, $ionicSlideBoxDelegate, $window, API_URL, Toast, LSFactory,VisitorsService,FIREBASE_MESSAGES,Messages) {
	$scope.username="";
	$scope.password="";
	$scope.devices = [];
	$scope.locations = [];
	$scope.products = [];
	$scope.users = [];
	$scope.servers = [];
	$scope.cleanVisitors = VisitorsService.getVisitors();
	$scope.visitors= [];
	$scope.messages = [];
	
	Messages(FIREBASE_MESSAGES).$bindTo($scope, "fbMBind");
    $scope.$watch('fbMBind', function() {
        doRefreshMessages();
    }); 
	
	$scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
	}, true);
	
	function doRefreshMessages() {
		$scope.messages = [];
		$scope.totalMessages = 0;
		angular.forEach($scope.fbMBind, function(message){
			if (!message || !message.expositor) {
				return;
			}
            $scope.messages.push(message);
            $scope.totalMessages++;
		});
    }
    
    function visitorsToArray(oVisitors) {
		$scope.visitors = [];
		$scope.totalPeople = 0;
		oVisitors.forEach(function (visitor) {
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor); 
            //console.log("--> ",visitor);
            $scope.totalPeople++;
		});
    }
	
	$scope.refreshDataAmount = function(){
		Api.Device.query({}, function(data){
			$scope.devices=data;
			var count=0;
		});
	    Api.Location.query({}, function(data){$scope.locations=data;});
	    Api.Product.query({}, function(data){$scope.products = data;});
	    Api.User.query({},function(data){$scope.users = data;});
	    Api.Server.query({},function(data){$scope.servers = data;});
	}
	$scope.refreshDataAmount();
	

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
	
	$scope.deviceTap = function(route, data) {
		$scope.device = data;
		$scope.singleProduct = data;
		shareComponentService.addDevice(data);
		
		storeService.jsonWrite("shareData",data);
		shareComponentService.addDevice(data);
		
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
	
	$scope.deviceSelect = function(route, data) {
  		console.log("device select");
  		storeService.jsonWrite('singleDevice',data);
  		$state.go(route, {'tagid' : data.tagid});
  	};
})