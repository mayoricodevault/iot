'use strict';

app.controller('Users', function($scope, $ionicActionSheet) {
	ionic.DomUtil.ready(addMaps);
	var adminLat = new google.maps.LatLng(43.07493,-89.381388);
	var userLat = new google.maps.LatLng(45.07493,-88.381388);
	var mapOptions = {
		center: adminLat,
		zoom: 16,
		draggable: false,
		scrollwheel: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapOptions2 = {
		center: userLat,
		zoom: 11,
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
});