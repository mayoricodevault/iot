'use strict';
app.controller('Dashboard', ['$scope','Socket','$interval', 'Api', 'Toast', '$rootScope', function($scope, Socket , $interval, Api,Toast) {
        
  $scope.messages = [];
  $scope.devices = [];
  $scope.numberofusers=0;
	$scope.messagesPoolCount=0;
	$scope.messagesBaristaPoolCount=0;
	$scope.messagesKioskPoolCount = 0;
	$scope.messagesWelcomePoolCount =0;
	$scope.messagesDashboardPoolCount =0;
	$scope.messagesXternalPoolCount=0;
	$scope.messagesVizixPoolCount=0;
  $scope.individualBoard=0;
  
   doRefreshAll();
//	var maximum = 150;
	$scope.data = [[]];
	$scope.labels = ["Barista", "Kiosk", "Welcome", "Dashboard", "xternal", "vizix"];
  // ;
  // $scope.series = ['Messages'];
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];

	$scope.options =  {
      animation: true,
      showScale: true,
      datasetStrokeWidth: 0.5
  }; 

  function getLiveChartData () {
      $scope.data = [[$scope.messagesBaristaPoolCount, $scope.messagesKioskPoolCount, $scope.messagesWelcomePoolCount,$scope.messagesDashboardPoolCount, $scope.messagesXternalPoolCount, $scope.messagesVizixPoolCount]  ];
    }

  	$interval(function () {
  		getLiveChartData();
  	}, 40);
	
	  Socket.on('xternal', function(data){
      $scope.messagesPoolCount += 1;
      $scope.messages.push(data);
      Toast.show('Incoming.....');
    });
    $scope.$on('socket:connect', function (ev, data) {
			Toast.show('Connecting....'+ data);
    });
    Socket.on('message', function(data){
      if (data.deviceType == 'barista') {
          $scope.messagesBaristaPoolCount +=1;
      }
      if (data.deviceType == 'dashboard') {
          $scope.messagesDashboardPoolCount +=1;
      }
      if (data.deviceType == 'kiosk') {
          $scope.messagesKioskPoolCount +=1;
      }
      if (data.deviceType == 'welcome') {
          $scope.messagesWelcomePoolCount +=1;
      }
      if (data.deviceType == 'xternal') {
          $scope.messagesXternalPoolCount +=1;
      }
      if (data.deviceType == 'vizix') {
          $scope.messagesVizixPoolCount +=1;
      }
  		$scope.messagesPoolCount += 1;
      $scope.messages.push(data.message);
    });
	  
  $scope.doRefresh = function() {
        doRefreshAll();
    };
	
	function doRefreshAll() {
	  $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading Devices.....');
        Api.Device.query({}, function(data){
             $scope.devices = data;
    });
	}

	
}]);