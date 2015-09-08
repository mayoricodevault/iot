app.controller('devicesCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','SessionService', "$http",'API_URL','VisitorsService','storeService','$state','shareComponentService', 'Socket', 'Sessions','FIREBASE_URI_SESSIONS',function($scope, Api, $ionicPopup, Toast,SessionService, $http, API_URL,VisitorsService,storeService,$state,shareComponentService, Socket,Sessions,FIREBASE_URI_SESSIONS) {
    
    
    
    $scope.devices = [];
    $scope.form = {};
    $scope.cleanSessions =[];
    $scope.listCanSwipe = true;
    Api.Device.query({}, function(data){
            $scope.devices = data;
            $scope.refreshDataAmount();
        });
    
    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefreshAll();
    });    
    
	$scope.deviceSelect = function(route, data) {
	   
		$scope.device = data;
		$scope.singleProduct = data;
		//shareComponentService.addDevice(data);
		storeService.jsonWrite('singleDevice',data);
		$state.go(route, {'tagid' : data.tagid});
	};
	
    $scope.delete = function(device){
        $scope.selTagId=device.tagid;
         doRefreshAll();
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Delete this device ' +device.devicename +'?'
       });
       
       confirmPopup.then(function(res) {
         if(res) {
             if($scope.total>0){
                Toast.show('Can not delete device:'+device.devicename);    
             }else{
                Api.Device.delete({id: device._id}, function(data){
                     doRefreshAll();
                });
             }
         } 
       });
    };
    
	$scope.doRefresh = function() {
       doRefreshAll();
    };
    
    function doRefreshAll() {
        $scope.total=0;
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
            $scope.devices = data;
            $scope.refreshDataAmount();
        });
        angular.forEach($scope.fbBind, function(session){
            
	        if (!session || !session.deviceName) {
            	    return;
            }
		  
            if (session.tagId == $scope.selTagId && isUrl(session.serverUrl) ) {
                if (!session.isdeleted) {
                    $scope.sessionArray.push(session);    
            		$scope.total++;
        	    } 
            }
        });        
    }
    
        
    $scope.$watch('fbBind', function() {
        doRefreshAll();
    });  
        
      $scope.sessionArray = [];
      Sessions(FIREBASE_URI_SESSIONS).$bindTo($scope, "fbBind");
    function isUrl(s) {
    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    	return regexp.test(s);
    }
         
      
        
}]);