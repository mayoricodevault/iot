'use strict';

app.controller('Users', ['$scope','$ionicActionSheet','Api', 'Toast', '$ionicPopup','storeService','$state', function($scope, $ionicActionSheet,Api,Toast,$ionicPopup,storeService,$state) {
	
	$scope.users = [];
	
	Api.User.query({},function(data){
		$scope.users = data;
	});
	
	ionic.DomUtil.ready(addMaps);
	var adminLat = new google.maps.LatLng(-16.5411128,-68.088327);
	var mapOptions = {
		center: adminLat,
		zoom: 16,
		draggable: false,
		scrollwheel: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	function addMaps () {
		var map = new google.maps.Map(document.getElementById("map_admin"),
		mapOptions);
		$scope.map = map;
		var map2 = new google.maps.Map(document.getElementById("map_stacy"),
		mapOptions2);
		$scope.map2 = map2;
	};
	
	
	$scope.userHold = function(user) {
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: 'Sample Button' }
			],
			destructiveText: 'Delete',
			titleText: 'Modify a User',
			cancelText: 'Cancel',
			cancel: function() {
			},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(index) {
				$scope.users.splice($scope.users.indexOf(user), 1);
				return true;
			}
		});
	}
	
	$scope.deleteUser = function(user){
		console.log("deleteUser");
        var confirmPopup = $ionicPopup.confirm({
        	title: 'Delete!',
        	template: 'Are you sure you want to delete this user? ' +user.username
        	
        });
       confirmPopup.then(function(res) {
         if(res) {
            Api.User.delete({id: user._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.editUser = function(route, user) {
		$scope.user = user;
		storeService.jsonWrite('shareData',user);
		$state.go(route);
	};
	
	
	$scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.User.query({}, function(data){
             $scope.users = data;
             $scope.refreshDataAmount();
        });
    }
	
}]);