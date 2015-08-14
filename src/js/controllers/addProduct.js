'use strict';

app.controller('addProduct', function($scope) {
	$scope.setFormScope = function(scope){
		this.formScope = scope;
	}
	$scope.newproduct = {};
	$scope.productSubmit = function() {
		if(!$scope.newproduct.name) {
			alert('Name required');
			return;
		}
		if(!$scope.newproduct.icon) {
			$scope.newproduct.icon = 'ion-alert';
		}
		$scope.products.push($scope.newproduct);
		this.formScope.addProductForm.$setPristine();
		var defaultForm = {
			name : "",
			icon : "",
			large : "",
			medium : "",
			small : "",
			reatred: "",
		};
		
		console.log("data --> ",$scope.newproduct);
		$scope.newproduct = defaultForm;
	};
});