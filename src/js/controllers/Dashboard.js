'use strict';

app.controller('Dashboard', function($scope, $interval) {
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
});