'use strict';

app.controller('servers', ['$scope', 'Api', '$ionicPopup','Toast' , function($scope, Api, $ionicPopup, Toast) {

    $scope.form = {};
  	$scope.listCanSwipe = true;

	$scope.newserver = {
		name : "",
		ipaddress : "",
		url : ""
	};
	
	/*
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    });	
	*/

	
	$scope.formScope=null;
	$scope.setFormScope = function(frmServer){
		this.formScope = frmServer;
	}
	
	$scope.doRefresh;
	
	$scope.serverSubmit = function() {
		if(!$scope.newserver.name) {
		    Toast.show("The field Name is required.");
			return;
		}
		
		if(!$scope.newserver.ipaddress) {
		    Toast.show("The field Ip Address is required.");
			return;
		}		
		
		if(!$scope.newserver.url) {
		    Toast.show("The field Url is required.");
			return;
		}		
		
		if(!$scope.validateUrl($scope.newserver.url)){
			Toast.show("The value Url is invalid.");
			return;
		}
		
		Api.Server.save({},$scope.newserver,
			function(data){
				$scope.servers.push($scope.newserver);
				
				var defaultForm = {
					name : "",
					ipaddress : "",
					url : ""
				};
				$scope.newserver = defaultForm;	
				Toast.show("Add Successful.");
			},
		function(err){
			Toast.show("System Error. "+err.statusText);
			return false;
		});
	}; // end submit
	

    $scope.delete = function(server){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this server: ' +server.name +"?"
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Server.delete({id: server._id}, function(data){
                $scope.doRefresh();
                $scope.refreshDataAmount();
            });
         } 
       });
    }
    
    
	$scope.validateUrl=function (value){
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    };    
    
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Server.query({}, function(data){
             $scope.servers = data;
             $scope.refreshDataAmount();
        });
    }; //end doRefresh    
	 
}]);
