app.controller('deviceCtrl', ['$scope', 'Api','$ionicPopup', 'Toast', function($scope, Api, $ionicPopup, Toast) {
    $scope.form = {};
    $scope.devices = [];

    
    Api.Device.query({}, function(data){
        $scope.devices = data;
    
    });
    console.log($scope.devices);
    $scope.deleteAll = function(){
        Api.Device.delete({}, function(data){
            $scope.devices = [];
        })
    }
    
    $scope.delete = function(index){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this device?'
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Device.delete({id: $scope.devices[index]._id}, function(data){
                $scope.devices.splice(index, 1);
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
        Toast.show('Loading Devices.....');
        Api.Device.query({}, function(data){
             $scope.devices = data;
        });
    }
}]);