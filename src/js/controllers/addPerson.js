'use strict';
app.controller('addPerson',['$scope','Api','$ionicPopup','$cordovaToast','Toast', '$http', 'API_URL', function($scope,Api,$ionicPopup,$cordovaToast,Toast, $http, API_URL) {

	console.info("mensaje"+API_URL);
	$scope.newPerson = function(){
		Toast.show("Getting New User");
		$http.get(API_URL + '/random-user')
		.success(function(data){
			console.log(data);
			
			$scope.new_person = data.user;
			
		  var people = {
		  		 name: $scope.new_person.name,
		  		 email: $scope.new_person.email,
		  		 username: $scope.new_person.username,
		  		 address: $scope.new_person.address,
		  		 phone: $scope.new_person.phone,
		  		 company: $scope.new_person.company
		  };
			
		  $http.post(API_URL + '/add-people', { people: people }).
          then(function(response) {
             Toast.show("Sending Request....", 30);
          }, function(response) {
              Toast.show(response.statusText + " "+ response.data.error, 30);
         });
			
			
			
			
			
			
			
			
		})
	}
	
}]);