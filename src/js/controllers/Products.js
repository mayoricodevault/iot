
app.controller('productCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','shareComponentService','$state', function($scope, Api, $ionicPopup, Toast, shareComponentService,$state) {
    $scope.form = {};
    $scope.products = [];
    $scope.listCanSwipe = true;
    
    Api.Product.query({}, function(data){
        $scope.products = data;
        console.log("products --> ", $scope.products);
    });
    
    $scope.productTap = function(route, product) {
		$scope.product = product;
		shareComponentService.addDevice(product);
		$state.go(route);
	};
    
    console.log($scope.products);
    $scope.deleteAll = function(){
        Api.Product.delete({}, function(data){
            $scope.products = [];
        })
    }
    
    $scope.delete = function(product){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this product? ' +product._id
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Product.delete({id: product._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.addToDatabase = function(){
        Api.Product.save({}, $scope.form, 
        function(data){
            $scope.products.push(data);
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
        Api.Product.query({}, function(data){
             $scope.products = data;
        });
    }
}]);