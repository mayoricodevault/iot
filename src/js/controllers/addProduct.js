'use strict';

app.controller('addProduct',['$scope','Api','$ionicPopup','Toast' ,function($scope,Api,$ionicPopup,Toast) {
	
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newproduct = {};
	
	$scope.productSubmit = function() {
		if(!$scope.newproduct.productname) {
			Toast.show("The field Name is required.");
			return;
		}
		if(!$scope.newproduct.icon) {
			$scope.newproduct.icon = 'ion-alert';
		}
		
		Api.Product.save({}, $scope.newproduct,
			function(data){
				//this.formScope.addProductForm.$setPristine();
				$scope.products.push($scope.newproduct);
				var defaultForm = {
					productname : "",
					icon : "",
					large : "",
					medium : "",
					small : "",
					featured: "",
				};
				
				$scope.newproduct = defaultForm;
				Toast.show("Add Successful.");
			},
			function(err){
				Toast.show(err.data);
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