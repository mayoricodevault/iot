'use strict';

app.controller('Charts', function($scope, $interval) {
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
});