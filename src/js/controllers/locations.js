'use strict';

app.controller('locations', ['$scope', 'Api', '$ionicPopup','Toast' , function($scope, Api, $ionicPopup, Toast) {

    $scope.form = {};
    $scope.locations = [];
  	$scope.listCanSwipe = true;

    Api.Location.query({}, function(data){
    	$scope.locations=data;
    	console.info("** locations "+$scope.locations);
    }); // end query



    $scope.delete = function(location){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this location? ' 
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Location.delete({id: location._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.addToDatabase = function(){
        Api.Location.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err)
        });
    };//end add
    
    
       $scope.showAlert = function(errTitle, errMsg) {
	   	var alertPopup = $ionicPopup.alert({
	    	 title: errTitle,
	     	template: errMsg
	   		});
	   		alertPopup.then(function(res) {
	   	});
	   };// end alert
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
             $scope.locations = data;
        });
    }; //end doRefresh
	 
}]);
