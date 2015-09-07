app.controller('devicesCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','SessionService', "$http",'API_URL','VisitorsService','storeService','$state','shareComponentService', 'Socket', function($scope, Api, $ionicPopup, Toast,SessionService, $http, API_URL,VisitorsService,storeService,$state,shareComponentService, Socket) {
    
    
    
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
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Delete this device? ' +device.tagid
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Device.delete({id: device._id}, function(data){
                 doRefreshAll();
            });
         } 
       });
    };
    
	$scope.doRefresh = function() {
       doRefreshAll();
    };
    
    function doRefreshAll() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
            $scope.devices = data;
            $scope.refreshDataAmount();
        });
    }
    
        
        
      $scope.sessionArray = [];
      Sessions(FIREBASE_URI_SESSIONS).$bindTo($scope, "fbBind");
        angular.forEach($scope.fbBind, function(session){
        	if (!session || !session.deviceName) {
        		return;
        	}
        	if (session.tagId == $scope.selTagId && isUrl(session.serverUrl) ) {
        	    if (!session.isdeleted) {
                    $scope.sessionArray.push(session);    
            		total++;
        	    } else {
        	        if ($scope.timeStamp != session.ping_dt && session.isdeleted && $scope.resetRequestSend ) {
            	         Toast.show("Resetting ....", 30);
            	         $http.post(API_URL + '/sync', {sessionid : session.sessionid, socketid: session.socketid, action : 'reset', tagId : session.tagId, url : session.serverUrl}).
                          then(function(response) {
                      
                         }, function(response) {
                              Toast.show(response.statusText + " "+ response.data.error, 30);
                         });
                          	$scope.resetRequestSend = false;
        	        } else {
        	             SessionService.removeSession(session.socketid);
        	        }
        	    }
        	}
       
        });
        console.info("**** ARRAY "+$scope.sessionArray+" AAA");
         
        
}]);