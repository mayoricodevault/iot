'use strict';

app.controller('people', ['$scope', 'Api', '$ionicPopup','Toast' ,'VisitorsService','$rootScope', function($scope, Api, $ionicPopup, Toast,VisitorsService,$rootScope) {

	$scope.cleanVisitors = VisitorsService.getVisitors();
    $scope.visitors = [];
    //$scope.totalCount=0;
 
    
    $scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
	//	console.info("Nro de visitantes "+$scope.totalCount);
	}, true);
    
    
    function visitorsToArray(oVisitors) {
        var total = 0;
		$scope.visitors = [];
		oVisitors.forEach(function (visitor) {
			// Skip invalid entries so they don't break the entire app.
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
			total++;
		});
		$rootScope.totalPeople = total;
    }    
    
	$scope.people=$scope.visitors;
	$scope.doRefresh;
    
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
		$scope.cleanVisitors = VisitorsService.getVisitors();
    }; //end doRefresh    
	 
}]);
