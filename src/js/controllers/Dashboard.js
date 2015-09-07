'use strict';
app.controller('Dashboard', ['$scope','Socket','$interval', 'Api', 'Toast', '$rootScope', function($scope, Socket , $interval, Api,Toast) {
        
  $scope.messages = [];
  $scope.devices = [];
  $scope.numberofusers=0;
	$scope.messagesPoolCount=0;
  $scope.individualBoard=0;
  
   doRefreshAll();
//	var maximum = 150;
//	$scope.data = [[]];
  $scope.labels = ["Msgs"];
  $scope.series = ['Messages'];
  $scope.data = [[]];
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];

	$scope.options =  {
		responsive: true,
		showTooltips: false,
		animation: true,
		pointDot : false,
		scaleShowLabels: false,
		showScale: true,
		maintainAspectRatio: false,
		datasetStrokeWidth : 2,
  }; 



  	$interval(function () {
  		getLiveChartData();
  	}, 500);

	 // getLiveChartData();
	
	 Socket.on('xternal', function(data){
      $scope.messagesPoolCount = data.msgs;
      $scope.messages.push(data);
      Toast.show('Incoming.....');
    });
    $scope.$on('socket:connect', function (ev, data) {
			Toast.show('Connecting....'+ data);
    });
    Socket.on('message', function(data){
    		$scope.messagesPoolCount = data.msgs;
        $scope.messages.push(data);
    });
	  // $scope.$on('$locationChangeStart', function(event){
   //     Socket.disconnect(true);
   // })
	
	  
  $scope.doRefresh = function() {
        doRefreshAll();
    }
	
	function doRefreshAll() {
	  $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading Devices.....');
        Api.Device.query({}, function(data){
             $scope.devices = data;
    });
	}
	
	 function getLiveChartData () {
      if ($scope.data[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.data[0] = $scope.data[0].slice(1);
      }
      $scope.labels.push('');
      $scope.data[0].push($scope.messagesPoolCount);
    }
	
}]);