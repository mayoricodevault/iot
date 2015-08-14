'use strict';
app.controller('Dashboard', ['$scope','Socket','$interval', function($scope, Socket , $interval) {
	Socket.connect( );
  $scope.messages = [];
  $scope.numberofusers=0;
	$scope.messagesPoolCount=0;
  $scope.individualBoard=0;
	var maximum = 150;
	$scope.data = [[]];
	$scope.labels = [];
	for (var i = 0; i < maximum; i++) {
		$scope.data[0].push(0);
		$scope.labels.push("");
	}
	$scope.options =  {
		responsive: true,
		showTooltips: true,
		animation: true,
		pointDot : false,
		scaleShowLabels: true,
		showScale: true,
		maintainAspectRatio: false,
		datasetStrokeWidth : 2,
    }; 

    function getLiveChartData () {
      if ($scope.data[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.data[0] = $scope.data[0].slice(1);
      }
      $scope.labels.push('');
      $scope.data[0].push($scope.messagesPoolCount);
    }
	// Simulate async data update
	$interval(function () {
		getLiveChartData();
	}, 500);
	Socket.on('xternal', function(data){
      $scope.messagesPoolCount = data.msgs;
    		
      $scope.messages.push(data);
       
    });
    Socket.on('connect', function () {
    		console.log("sssss");
    });
    Socket.on('message', function(data){
    		$scope.messagesPoolCount = data.msgs;
        $scope.messages.push(data);
    });
	  // $scope.$on('$locationChangeStart', function(event){
   //     Socket.disconnect(true);
   // })
	
}]);