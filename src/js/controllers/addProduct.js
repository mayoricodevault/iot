'use strict';

app.controller('addProduct',['$scope','Api','$ionicPopup' ,function($scope,Api,$ionicPopup) {
	
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newproduct = {};
	
	$scope.productSubmit = function() {
		if(!$scope.newproduct.productname) {
			$scope.showAlert("Incorrect Value !!","Invalid Product Name!");
			return;
		}
		if(!$scope.newproduct.icon) {
			$scope.newproduct.icon = 'ion-alert';
		}
		
		console.log("Product --> ",$scope.newproduct);
		
		Api.Product.save({}, $scope.newproduct,
			function(data){
				//this.formScope.addProductForm.$setPristine();
				var defaultForm = {
					productname : "",
					icon : "",
					large : "",
					medium : "",
					small : "",
					featured: "",
				};
				
				$scope.newproduct = defaultForm;
			},
			function(err){
				$scope.showAlert("System Error!!!",err.statusText);
				return false;
			}
		);
	};
	
	$scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {});
	 };
}]);