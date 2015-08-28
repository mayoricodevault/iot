'use strict';

app.controller('editProduct', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','storeService', function($scope, Api, $ionicPopup, $cordovaToast, storeService) {
	$scope.products = [];
	$scope.newproduct = storeService.jsonRead("shareData");
	console.log("new Product --> ",$scope.newproduct);
	$scope.formScope=null;
	$scope.setFormScope = function(frmProduct){
		$scope.formScope = frmProduct;
	}
	
	$scope.productSubmit = function() {
		if(!$scope.newproduct.productname) {
			$scope.showAlert("Incorrect Value !!","Invalid Product Name!");
			return;
		}
		if(!$scope.newproduct.icon) {
			$scope.newproduct.icon = 'ion-alert';
		}
		if(!$scope.newproduct.large) {
			$scope.showAlert("Incorrect Value !!","Invalid Large Value!");
			return;
		}
		
		Api.Product.save({id:$scope.newproduct._id}, $scope.newproduct, 
        function(data){
        	Toast.show("Update Successful.");
			$scope.products.push($scope.newproduct);
        },
        function(err){
        	Toast.show("System Error." + err.statusText);
			return false;
        });
	
	};

	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
}]);
