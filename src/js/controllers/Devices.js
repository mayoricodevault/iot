app.controller('deviceCtrl', ['$scope', 'Api','$ionicPopup', 'Toast', function($scope, Api, $ionicPopup, Toast) {
    $scope.form = {};
    $scope.devices = [];
    $scope.listCanSwipe = true;
    
    Api.Device.query({}, function(data){
        $scope.devices = data;
        console.log("devices --> ", $scope.devices);
    });
    console.log($scope.devices);
    $scope.deleteAll = function(){
        Api.Device.delete({}, function(data){
            $scope.devices = [];
        })
    }
    
    $scope.delete = function(device){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this device? ' +device.tagid
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Device.delete({id: device._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.addToDatabase = function(){
        Api.Device.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err)
        });
    }
    
    $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
             $scope.devices = data;
        });
    }
}]);