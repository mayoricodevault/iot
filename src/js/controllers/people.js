'use strict';

app.controller('people', ['$scope', 'Api', '$ionicPopup','Toast' ,'VisitorsService','$rootScope','SessionService','$http','API_URL',function($scope, Api, $ionicPopup, Toast,VisitorsService,$rootScope,SessionService, $http,API_URL) {

	$scope.cleanVisitors = VisitorsService.getVisitors();
    $scope.visitors = [];
    $scope.selectPeople = false
    
    //getDevices
    $scope.devices = [];
    $scope.baristas = [];
    $scope.products = [];
    $scope.data = {};
    
 	Api.Device.query({}, function(data){
    	$scope.devices=data;
    	for(var key in data){
    	    if(data[key].type=='Barista'){
    	        $scope.baristas.push(data[key]);
    	    }
    	}
    	
    }); // end query    
    
    Api.Product.query({}, function(data){
    	$scope.products=data;
    }); // end query
    
    
    //$scope.totalCount=0;
 	$scope.listCanSwipe = true;
    
    $scope.cleanSessions = SessionService.getSessions();
    $scope.sessionArray = [];    
    
    $scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
	//	console.info("Nro de visitantes "+$scope.totalCount);
	}, true);
    
    
    function visitorsToArray(oVisitors) {
        var total = 0;
		$scope.visitors = [];
		oVisitors.forEach(function (visitor) {
			// Skip invalid entries so they don't break the entire app.
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
			total++;
		});
		$rootScope.totalPeople = total;
    }    
    
	$scope.people=$scope.visitors;
	$scope.doRefresh;
    
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
		$scope.cleanVisitors = VisitorsService.getVisitors();
    }; //end doRefresh    
	 
	 
    $scope.testSession = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<label class="item item-input item-select">'+
                        '<span class="input-label">'+
                            'Select a Device'+
                        '</span>'+
                        '<select class="form-control margin-bottom" ng-model="data.name" ng-options="d.devicename as d.devicename for d in devices"><option></option></select>'+
                      '</label>'+
                    '</div>',
            title: 'Test',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Send</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if(!$scope.data.name){
                            Toast.show("No name selected", 100);
                        }else{
                            var favcoffee = "";
                            if ( $scope.data.name.favcoffee) {
                                favcoffee = $scope.data.name.favcoffee;
                            }
                             if ( $scope.data.name.favcoffe) {
                                favcoffee = $scope.data.name.favcoffe;
                            }
                            $http.post(API_URL + '/remotekiosk', { 
                                
                                name : $scope.data.name.name,
                                favcoffee : favcoffee,
                                zipcode : $scope.data.name.zipcode,
                                email : $scope.data.name.email,
                                zonefrom : "IoT",
                                zoneto : session.sessionid,
                                companyname : $scope.data.name.companyname
                            }).
                              then(function(response) {
                                 Toast.show("Sending ....", 30);
                              }, function(response) {
                                  Toast.show(response.statusText + " "+ response.data.error, 30);
                             });
                            
                        }
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    }
    
    
    
    $scope.testTransaction = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<label class="item item-input item-select">'+
                            '<div class="input-label">'+
                                'Select a Barista'+
                            '</div>'+
                            '<select class="form-control margin-bottom" ng-model="data.barista" ng-options="d.devicename as d.devicename for d in baristas"><option></option></select>'+
                        '</label>'+
                        '<label class="item item-input item-select">'+
                            '<div class="input-label">'+
                                'Select a Product'+
                            '</div>'+
                            '<select class="form-control margin-bottom" ng-model="data.product" ng-options="d._id as d.productname for d in products"><option></option></select>'+
                        '</label>'+
                    '</div>',
            title: 'Test Transaction',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Send</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        
                        console.log("barista selected --> ",$scope.data.barista);
                        console.log("product selected --> ",$scope.data.product);
                        
                        if(typeof $scope.data.barista=='undefined'||!$scope.data.barista){
                            Toast.show("Please select a barista");
                            return;
                        }
                        if(typeof $scope.data.product=='undefined'||!$scope.data.product){
                            Toast.show("Please select a product");
                            return;
                        }
                        
                        $scope.transaction = {
                            trnsno: 'dos',
                            email: 'tran@gmail.com',
                            product: 'Latte',
                            tagid: '2323',
                            zipcode: '232344',
                            region: 'california',
                            dt: new Date()
                        }
                        
                        //save transaction
                        Api.Transaction.save({}, $scope.transaction, 
                        function(data){
                			console.log("resp: ",data)
                			$scope.doRefresh();
                        },
                        function(err){
                        	Toast.show(err.data);
                			return false;
                        });
                        
                        /*$http.post(API_URL + '/remotekiosk', { 
                                
                                name : $scope.data.name.name,
                                favcoffee : favcoffee,
                                zipcode : $scope.data.name.zipcode,
                                email : $scope.data.name.email,
                                zonefrom : "IoT",
                                zoneto : session.sessionid,
                                companyname : $scope.data.name.companyname
                            }).
                              then(function(response) {
                                 Toast.show("Sending ....", 30);
                              }, function(response) {
                                  Toast.show(response.statusText + " "+ response.data.error, 30);
                             });
                            
                        }*/
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    }
    
    function ifAnySelected(){
    	for(var key in $scope.visitors){
    		if($scope.visitors[key].checked){
    			console.log("checked: ",$scope.visitors[key].checked);
    			return true;
    		}
    	}
    	return false;
    }
    
    $scope.test = function(){
    	if(ifAnySelected()){
    		$scope.testSession();
    	}else{
    		Toast.show("No people selected", 20);
    	}
    }
    
    $scope.showCheckBoxes = function(){
    	$scope.selectPeople = true;
    }
    
    $scope.hideCheckBoxes = function(){
    	$scope.selectPeople = false;
    }
    
}]);
