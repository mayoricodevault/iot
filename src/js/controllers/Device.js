app.controller('deviceCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','SessionService', "$http",'API_URL','VisitorsService','storeService','$state','shareComponentService', 'Socket', '$stateParams','Sessions','FIREBASE_URI_SESSIONS', function($scope, Api, $ionicPopup, Toast,SessionService, $http, API_URL,VisitorsService,storeService,$state,shareComponentService, Socket, $stateParams, Sessions, FIREBASE_URI_SESSIONS) {
    $scope.activeSessions ={};
    $scope.sessionArray = [];
    $scope.selTagId = $stateParams.tagid;
    $scope.timeStamp = new Date().getTime();
    Sessions(FIREBASE_URI_SESSIONS).$bindTo($scope, "fbBind");
    
    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefreshAll();
    });   
    
    $scope.$watch('fbBind', function() {
        doRefreshAll();
    });    
   
    function doRefreshAll() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        var total = 0;
        $scope.sessionArray = [];
        angular.forEach($scope.fbBind, function(session){
        	if (!session || !session.deviceName) {
        		return;
        	}
        	if (session.tagId === $scope.selTagId && typeof session.serverUrl != 'undefined') {
        	    if (isUrl(session.serverUrl)) {
        	        sendPing(session, $scope.timeStamp);
                    $scope.sessionArray.push(session);    
        			total++;
        	    }
        	}
        });
        $scope.totalCount = total;        
		
    }
   
    $scope.devices = [];
    $scope.listCanSwipe = true;
    $scope.sessionArray = [];
    $scope.arraySessions = [];
    
    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefreshAll();
    });    
    
    $scope.newSnapShot = "";
 
 
    $scope.visitorsTmp = [];
    $scope.visitors = [];
    $scope.imgSelected = false;
    
    //$scope.cleanVisitors = VisitorsService.getVisitors();
    // $scope.singleProduct= storeService.jsonRead('singleDevice');
    $scope.showImage = false;
    
     /*$scope.$watch('cleanVisitors', function () {
         $scope.visitors = $scope.cleanVisitors;
 	}, true);*/
 	
 	
 	var fbBindVisitors =  VisitorsService.getVisitors();
    fbBindVisitors.$bindTo($scope, "visitorsTmp").then(function() {

        
        var total = 0;
		$scope.visitors = [];
		angular.forEach($scope.visitorsTmp, function(visitor){
		    console.log("visitor--> ",visitor);
			if (!visitor || !visitor.name) {
				return;
			}
		
            $scope.visitors.push(visitor);    
		});
		$scope.totalCount = total;
    }); 
 	

	
	$scope.filterbyTag = function(session) {
	    console.log(session);
	    return session === $scope.selTagId; 
	};

	$scope.deviceSelect = function(route, data) {
		$scope.device = data;
		$scope.singleProduct = data;
		//shareComponentService.addDevice(data);
		storeService.jsonWrite('singleDevice',data);
		$state.go(route);
	};



    $scope.deleteAll = function(){
        Api.Device.delete({}, function(data){
            $scope.devices = [];
        });
    };
    
    $scope.delete = function(device){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this device? ' +device.tagid
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Device.delete({id: device._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.addToDatabase = function(){
        Api.Device.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err)
        });
    }
    
    $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
	 $scope.resetSession = function (session) {
         $http.post(API_URL + '/sync', {sessionid : session.sessionid, socketid: session.socketid, action : 'reset', tagId : session.tagId, url : session.serverUrl}).
          then(function(response) {
              Toast.show("Reseting....", 30);
          }, function(response) {
              Toast.show(response.statusText + " "+ response.data.error, 30);
         });
	 };
	 
	 $scope.doRefresh = function() {
            doRefreshAll();
    };
    
    $scope.data = {};
    
    $scope.testSession = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<label class="item item-input item-select">'+
                        '<div class="input-label">'+
                            'Select Person'+
                        '</div>'+
                        '<select class="form-control margin-bottom" ng-model="data.name" ng-options="person as person.name for person in visitors"><option></option></select>'+
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
                                favcoffee : $scope.data.name.favcoffee,
                                zipcode : $scope.data.name.zipcode,
                                email : $scope.data.name.email,
                                zonefrom : "IoT",
                                zoneto : session.socketid,
                                companyname : $scope.data.name.companyname
                            }).
                              then(function(response) {
                                  console.log("response: ",response);
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
    
    function changeImage(){
        var sessionId = $scope.newSnapShot;
        console.log("sessionID: ",sessionId);
        for(var id in $scope.sessionArray){
            if($scope.sessionArray[id].socketid==sessionId){
                $scope.imgSelected = $scope.sessionArray[id].snapshot;
                console.log("imgSelected: ",$scope.imgSelected);
                return;
            }
        }
    }
    
    
    $scope.snapshot = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<div >'+
                        '</div>'+
                    '</div>',
            title: 'Snapshot',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Capture</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $http.post(API_URL + '/sync', { 
                            socketid :session.socketid,
                            sessionid : session.sessionid,
                            action : "snap",
                            tagId : session.tagId,
                            url : session.serverUrl
                        }).
                          then(function(response) {
                             Toast.show("Taking a Snap Shot....", 30);
                             $scope.showImage = true;
                             $scope.newSnapShot = session.socketid;
                          }, function(response) {
                              Toast.show(response.statusText + " "+ response.data.error, 30);
                         });
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    };
    
    $scope.ping = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<div >'+
                        '</div>'+
                    '</div>',
            title: 'Ping',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Ping</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                            sendPing(session, $scope.timeStamp);
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    };
    
    
    $scope.resetAll = function(){
        for(var idxSession in $scope.sessionArray){
            $scope.resetSession($scope.sessionArray[idxSession]);
        }
    };
    
    $scope.validSession = function(ts) {
        return $scope.timeStamp == ts;
    };
    
    function sendPing(session, timeStamp) {
 
         if(!isUrl(session.serverUrl )){
            return;
             
         }
         var postUrl = session.serverUrl;
         if (postUrl.slice(-1) == "/") {
             postUrl = postUrl.slice(0, postUrl.length - 1);
         }
         $http.post(postUrl + '/alive', { 
             sessionid : session.sessionid , 
             ts :timeStamp 
         }).
          then(function(response) {

          }, function(response) {

        });
    }
    function isUrl(s) {
    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    	return regexp.test(s);
    }
        
}]);