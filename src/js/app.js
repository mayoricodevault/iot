angular.module('iot', ['ionic','chart.js'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('router', {
      url: "/route",
      abstract: true,
      templateUrl: "templates/side-menu-left.html"
    })
    .state('router.dashboard', {
      url: "/dashboard",
	  abstract: true,
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html"
        }
      }
    })
	.state('router.dashboard.home', {
      url: "/home",
      views: {
        'home-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })
	.state('router.dashboard.favorites', {
      url: "/favorites",
      views: {
        'favorites-tab' :{
          templateUrl: "templates/favorites.html"
        }
      }
    })
	.state('router.dashboard.settings', {
      url: "/settings",
      views: {
        'settings-tab' :{
          templateUrl: "templates/settings.html"
        }
      }
    })
	.state('router.devices', {
      url: "/devices",
      views: {
        'menuContent' :{
          templateUrl: "templates/devices.html"
        }
      }
    })
	.state('router.device', {
      url: "/device",
      views: {
        'menuContent' :{
          templateUrl: "templates/device-single.html"
        }
      }
    })
	.state('router.locations', {
      url: "/locations",
      views: {
        'menuContent' :{
          templateUrl: "templates/locations.html"
        }
      }
    })
	.state('router.users', {
      url: "/users",
      views: {
        'menuContent' :{
          templateUrl: "templates/users.html"
        }
      }
    })
	.state('router.charts', {
      url: "/charts",
      views: {
        'menuContent' :{
          templateUrl: "templates/charts.html"
        }
      }
    })
	.state('router.actions', {
      url: "/actions",
      views: {
        'menuContent' :{
          templateUrl: "templates/actions.html"
        }
      }
    })
	.state('router.addUser', {
      url: "/add-user",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-user.html"
        }
      }
    })
	.state('router.addDevice', {
      url: "/add-device",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-device.html"
        }
      }
    })
	.state('router.addLocation', {
      url: "/add-location",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-location.html"
        }
      }
    })
	.state('router.addAction', {
      url: "/add-action",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-action.html"
        }
      }
    })
	.state('intro', {
      url: "/intro",
      templateUrl: "templates/intro.html"
    })
  $urlRouterProvider.otherwise("/intro");
})
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {
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
.controller('Intro', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup) {
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
})
.controller('Dashboard', function($scope, $interval) {
	var maximum = 150;
	$scope.data = [[]];
	$scope.labels = [];
	for (var i = 0; i < maximum; i++) {
		$scope.data[0].push(0);
		$scope.labels.push("");
	}
	$scope.options =  {
		responsive: true,
		showTooltips: false,
		animation: false,
		pointDot : false,
		scaleShowLabels: true,
		showScale: true,
		maintainAspectRatio: false,
		datasetStrokeWidth : 1,
    }; 

    function getLiveChartData () {
      if ($scope.data[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.data[0] = $scope.data[0].slice(1);
      }

      while ($scope.data[0].length < maximum) {
        $scope.labels.push('');
        $scope.data[0].push(getRandomValue($scope.data[0]));
      }
    }
	function getRandomValue (data) {
		var l = data.length, previous = l ? data[l - 1] : 50;
		var y = previous + Math.random() * 10 - 5;
		return y < 0 ? 0 : y > 100 ? 100 : y;
	}
	// Simulate async data update
	$interval(function () {
		getLiveChartData();
	}, 500);
})
.controller('Charts', function($scope, $interval) {
	$scope.linelabels = ["HW-1", "HW-3", "HW-3", "Welcome", "Barista Guest", "Barista Open", "DashBoard", "Satellite Stations"];
	$scope.lineseries = ['People', 'Cups of Coffee'];
	$scope.linedata = [
		[65, 76, 50, 47, 36, 30, 25, 48 ],
		[50, 48, 40, 57, 86, 99, 90, 58]
	];
	$scope.barlabels = ['2008', '2009', '2010', '2011', '2012', '2013', '2014'];
	$scope.barseries = ['Series A', 'Series B'];
	$scope.bardata = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];
	$scope.polarLabels = ["Latte", "Mocha", "Iced Cofee", "Capuccino", "Black"];
	$scope.polarData = [300, 500, 100, 40, 120];
	$scope.doughnutLabels = ["New York", "Florida", "Kansas", "Nevada","Texas", "Massachusets"];
	$scope.doughnutData = [300, 500, 100, 20, 34, 44];
	$scope.options =  {
		responsive: true,
		showTooltips: true,
		animation: true,
		pointDot : true,
		scaleShowLabels: true,
		showScale: true,
		maintainAspectRatio: false,
		datasetStrokeWidth : 1,
    };
	$interval(function () {
		$scope.doughnutData = [];
		$scope.polarData = [];
		
		for (var i = 0; i < 5; i++) {
			$scope.polarData.push(Math.floor(Math.random() * 500));
		}
		for (var i = 0; i < 6; i++) {
			$scope.doughnutData.push(Math.floor(Math.random() * 500));
		}
	}, 2500);
})
.controller('Actions', function($scope, $ionicActionSheet, $ionicModal) {
	$ionicModal.fromTemplateUrl('templates/edit-action.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.editaction = {};
	});
	$scope.actionHold = function(action) {
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: 'Edit' },
			],
			destructiveText: 'Delete',
			titleText: 'Modify Action',
			cancelText: 'Cancel',
			cancel: function() {
				return true;
			},
			buttonClicked: function(index) {
				$scope.editaction = action;
				$scope.modal.show();
				return true;
			},
			destructiveButtonClicked: function(index) {
				$scope.actions.splice($scope.actions.indexOf(action), 1);
				return true;
			}
		});
	}
})
.controller('Users', function($scope, $ionicActionSheet) {
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
})
.controller('addUser', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newuser = {};
	$scope.userSubmit = function() {
		if(!$scope.newuser.username) {
			alert('Username required');
			return;
		}
		if(!$scope.newuser.avatar) {
			$scope.newuser.avatar = 'img/noavatar.png';
		}
		$scope.newuser.lastLogin = 'Last login: never';
		$scope.newuser.id = $scope.users.length + 1;
		$scope.users.push($scope.newuser);
		this.formScope.addUserForm.$setPristine();
		var defaultForm = {
			id : "",
			username : "",
			avatar : "",
			location: false
		};
		$scope.newuser = defaultForm;
	};
})
.controller('addDevice', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newdevice = {};
	$scope.deviceSubmit = function() {
		if(!$scope.newdevice.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newdevice.icon) {
			$scope.newdevice.icon = 'ion-alert';
		}
		$scope.newdevice.id = $scope.devices.length + 2;
		$scope.devices.push($scope.newdevice);
		this.formScope.addDeviceForm.$setPristine();
		var defaultForm = {
			id : "",
			name : "",
			icon : "",
			status: "",
			color: "",
			userSelect : "",
			actionSelect : "",
			locationSelect : ""
		};
		$scope.newdevice = defaultForm;
	};
})
.controller('addLocation', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newlocation = {};
	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		$scope.locations.push($scope.newlocation);
		this.formScope.addLocationForm.$setPristine();
		var defaultForm = {
			name : "",
			icon : "",
			note : ""
		};
		$scope.newlocation = defaultForm;
	};
})
.controller('addAction', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newaction = {};
	$scope.newaction.type = 'range';
	$scope.newaction.state = 'on';
	$scope.actionSubmit = function() {
		if(!$scope.newaction.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newaction.iconBefore) {
			$scope.newaction.iconBefore = 'ion-ios7-minus-empty';
		}
		if(!$scope.newaction.iconAfter) {
			$scope.newaction.iconAfter = 'ion-ios7-plus-empty';
		}
		if(!$scope.newaction.units) {
			$scope.newaction.units = 'units';
		}
		if(!$scope.newaction.minValue) {
			$scope.newaction.minValue = '0';
		}
		if(!$scope.newaction.maxValue) {
			$scope.newaction.maxValue = '100';
		}
		$scope.actions.push($scope.newaction);
		this.formScope.addActionForm.$setPristine();
		var defaultForm = {
			name : "",
			value : "",
			state: "",
			minValue : "",
			maxValue : "",
			units : "",
			iconBefore : "",
			iconAfter : "",
			deviceSelect : "",
			script : "",
			featured : ""
		};
		$scope.newaction = defaultForm;
	};
})
.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
});