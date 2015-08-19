'use strict';

app.controller('locations', ['$scope', 'Api', '$ionicPopup','Toast' , function($scope, Api, $ionicPopup, Toast) {

    $scope.form = {};
    $scope.locations = [];
  	$scope.listCanSwipe = true;
	$scope.newlocation = {
		name : "",
		icon : "",
		note : "",
		featured : true
	};   //end json 
	
	$scope.locationsList=[
						{
							name:"ion-fork"
						},
						{
						   name:"ion-waterdrop"
						},{
							name:"ion-alert"
						}
		];	
	
	
	$scope.formScope=null;
	$scope.setFormScope = function(frmLocation){
		this.formScope = frmLocation;
	}
	

    Api.Location.query({}, function(data){
    	$scope.locations=data;
    }); // end query

	$scope.locationSubmit = function() {
		if(!$scope.newlocation.name) {
		    Toast.show("The field Name is required.");
			return;
		}
		
		if(!$scope.newlocation.icon) {
			$scope.newlocation.icon = 'ion-alert';
		}
		
    		Api.Location.save({},$scope.newlocation,
    			function(data){
    			$scope.locations.push($scope.newlocation);
    			var defaultForm = {
    				name : "",
    				icon : "",
    				note : "",
    				featured : true
    			};
    			$scope.newlocation = defaultForm;
    			Toast.show("Add Successful.");
    		},
    		function(err){
    		    Toast.show(err.data);
    			return false;
    		});
	}; // end submit

    $scope.delete = function(location){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this location? ' 
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Location.delete({id: location._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }// end delete
    
    $scope.addToDatabase = function(){
        Api.Location.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err)
        });
    };//end add
    
    
       $scope.showAlert = function(errTitle, errMsg) {
	   	var alertPopup = $ionicPopup.alert({
	    	 title: errTitle,
	     	template: errMsg
	   		});
	   		alertPopup.then(function(res) {
	   	});
	   };// end alert
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Location.query({}, function(data){
             $scope.locations = data;
        });
    }; //end doRefresh
	 
}]);
