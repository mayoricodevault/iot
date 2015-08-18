'use strict';

app.controller('editProduct', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','shareComponentService' , function($scope, Api, $ionicPopup, $cordovaToast, shareComponentService) {
	$scope.products = [];
	$scope.newproduct = shareComponentService.getDevice();
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
			$scope.products.push($scope.newproduct);
			$scope.formScope.addProductForm.$setPristine();
			var defaultForm = {
				productname : "",
				icon : "",
				large: "",
				medium : "",
				small : "",
				featured : 0
			};
			$scope.newproduct = defaultForm;
        },
        function(err){
        	$scope.showAlert("System Error!!!", err.statusText);
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
