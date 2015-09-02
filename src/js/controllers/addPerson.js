'use strict';
app.controller('addPerson',['$scope','Api','$ionicPopup','$cordovaToast','Toast', '$http', 'API_URL', function($scope,Api,$ionicPopup,$cordovaToast,Toast, $http, API_URL) {

		  $scope.new_person=[];
		  $scope.new_person = {
		  		 name: '',
		  		 email: '',
		  		 companyname: '',
		  		 zipcode: '',
		  		 zonefrom: "",
		  		 zoneto: "",
		  		 favcoffee: ''
		  };
	
	
	$scope.newPerson = function(){
		Toast.show("Getting New User");
		$http.get(API_URL + '/random-user')
		.success(function(data){
			
		var arrayDrink=['Americano','Cappuccino','Decaf Coffee','Espreso','Regular Coffee','Tea'];	
		var pos=Math.floor((Math.random() * 6) + 0);
			 $scope.coffee=arrayDrink[pos];
			$scope.new_person = data.user;
		})
	} // end function
	
	$scope.addPerson = function(){
		
			
		if($scope.new_person.name===''){
			Toast.show("Generate a person.", 30);
			return;
		}	
		  var people = {
		  		 name: $scope.new_person.name,
		  		 email: $scope.new_person.email,
		  		 companyname: $scope.new_person.company.name,
		  		 zipcode: $scope.new_person.address.zipcode,
		  		 zonefrom: "",
		  		 zoneto: "",
		  		 favcoffee: $scope.coffee
		  };
		
		
			
		  $http.post(API_URL + '/add-people', { people: people }).
          then(function(response) {
             Toast.show("Sending Request....", 30);
             $scope.new_person=[];
             $scope.coffee="";
          }, function(response) {
              Toast.show(response.statusText + " "+ response.data.error, 30);
         });
	}
	
}]);