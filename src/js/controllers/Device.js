app.controller('deviceCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','SessionService', "$http",'API_URL','VisitorsService','storeService','$state','shareComponentService', 'Socket', '$stateParams','Sessions','Visitors','FIREBASE_URI_SESSIONS', 'KIOSK_URL','FIREBASE_VISITORS', function($scope, Api, $ionicPopup, Toast,SessionService, $http, API_URL,VisitorsService,storeService,$state,shareComponentService, Socket, $stateParams, Sessions,Visitors, FIREBASE_URI_SESSIONS, KIOSK_URL, FIREBASE_VISITORS) {

    $scope.sessionArray = [];
    $scope.devices = [];
    $scope.listCanSwipe = true;
    $scope.newSnapShot = "";
    $scope.showImage = false;
    $scope.visitors = [];
    $scope.imgSelected = false;
    $scope.selTagId = $stateParams.tagid;
    $scope.resetRequestSend = false;
    $scope.timeStamp = new Date().getTime();
    $scope.fromDevice = {};
    Sessions(FIREBASE_URI_SESSIONS).$bindTo($scope, "fbBind");
    Visitors(FIREBASE_VISITORS).$bindTo($scope, "fbVBind");
    //get information from devices db
    Api.Device.query({}, function(data){
            for(var idx in data){
                if(data[idx].tagid==$scope.selTagId){
                    $scope.fromDevice = data[idx];
                    break;
                }
            }
        });
        
    
    $scope.$on('$ionicView.beforeEnter', function () {
        doRefreshAll();
    });   
    
    $scope.$watch('fbBind', function() {
        doRefreshAll();
        changeImage();
    });    
    
    $scope.$watch('fbVBind', function() {
         var total = 0;
		$scope.visitors = [];
		angular.forEach($scope.fbVBind, function(visitor){
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
		});
		$scope.totalVCount = total;
    }); 
   
    function doRefreshAll() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        if ($scope.sessionArray.length==0) {
            var session = Object();
            session.sessionid ="All";
            session.serverUrl = KIOSK_URL;
            session.isdeleted = false;
            sendPing(session, $scope.timeStamp, false);
            
        }
        var total = 0;
        $scope.sessionArray = [];
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
        $scope.totalCount = total;        
		 var total = 0;
		$scope.visitors = [];
		angular.forEach($scope.fbVBind, function(visitor){
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
		});
		$scope.totalVCount = total;
    }

	
	$scope.filterbyTag = function(session) {

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
    };
    
    $scope.addToDatabase = function(){
        Api.Device.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err);
        });
    };
    
    $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
	
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Refreshing and Requesting Sync...');
        if ($scope.sessionArray.length==0) {
            var session = Object();
            session.sessionid ="All";
            session.serverUrl = KIOSK_URL;
            session.isdeleted = false;
            sendPing(session, $scope.timeStamp, false);
        }        
        var total = 0;
        $scope.sessionArray = [];
        angular.forEach($scope.fbBind, function(session){
        	if (!session || !session.deviceName) {
        		return;
        	}
	        if (session.tagId == $scope.selTagId && isUrl(session.serverUrl) ) {
        	    if (!session.isdeleted) {
                    $scope.sessionArray.push(session);    
            		total++;
        	    } 
	        }
        });
        $scope.totalCount = total;        
    };
    
    $scope.data = {};
    
    $scope.testSession = function(session){
        $ionicPopup.show({
            template:   
                        '<div class="list">'+
                        '<label class="item item-input item-select">'+
                            '<span class="input-label">'+
                                'Select a Person'+
                            '</span>'+
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
                            $http.post(API_URL + '/remotekiosk', { 
                                zonefrom : "IoT",
                                zoneto : session.socketid,
                                tagId : $scope.data.name.id
                             }).
                              then(function(response) {
                                 Toast.show("Sending ...." +  $scope.data.name.name, 30);
                              }, function(response) {
                                  console.log(response);
                                  Toast.show(response.statusText + " "+ response.data.error, 30);
                             });
                            
                        }
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    };
    
    function changeImage(){
        var sessionId = $scope.newSnapShot;
        
        for(var id in $scope.sessionArray){
            if($scope.sessionArray[id].socketid==sessionId){
                $scope.imgSelected = $scope.sessionArray[id].snapshot;
                $scope.showImage = true;
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
                        sendPing(session, $scope.timeStamp, false);
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    };
    
    $scope.testDashboard = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<div >'+
                        '</div>'+
                    '</div>',
            title: 'Test Dashboard',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Send Random Data</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $http.post(API_URL + '/remotedashboard', { 
                            zonefrom : "IoT",
                            zoneto : session.socketid
                        }).
                        then(function(response) {
                           Toast.show("Sending ....", 30);
                        }, function(response) {
                             console.log(response);
                              Toast.show(response.statusText + " "+ response.data.error, 30);
                        });
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    };
    
    $scope.testDashboardXively = function(session){
        $ionicPopup.show({
            template:   '<div class="list">'+
                        '<div >'+
                        '</div>'+
                    '</div>',
            title: 'Test Dashboard Xively',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Send Random Data</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $http.post(API_URL + '/remotedashboardxively', { 
                            zonefrom : "IoT",
                            zoneto : session.socketid
                        }).
                        then(function(response) {
                           Toast.show("Sending ....", 30);
                        }, function(response) {
                             console.log(response);
                              Toast.show(response.statusText + " "+ response.data.error, 30);
                        });
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    }
    
    $scope.resetAll = function(){
        for(var idxSession in $scope.sessionArray){
            $scope.resetSession($scope.sessionArray[idxSession]);
        }
    };

    $scope.resetSession = function (session) {
        $scope.resetRequestSend = true;
        Toast.show("Resetting...." + session.socketid, 30);
        SessionService.updateSessionStatus(session.socketid, $scope.timeStamp, true);
        $scope.timeStamp = new Date().getTime();
        sendPing(session, $scope.timeStamp, false);
	 };
    
    $scope.validSession = function(ts) {
        return $scope.timeStamp == ts ;
    };
    
    function sendPing(session, timeStamp, isdeleted) {
         if(!isUrl(session.serverUrl )){
            return;
         }
         var postUrl = session.serverUrl;
         if (postUrl.slice(-1) == "/") {
             postUrl = postUrl.slice(0, postUrl.length - 1);
         }
         $http.post(postUrl + '/alive', { 
             sessionid : session.sessionid , 
             ts :timeStamp ,
             isdeleted : isdeleted
         }).
          then(function(response) {
               Toast.show("Reaching Up....", 30);
          }, function(response) {
             console.log(response);
        });
    }
    function isUrl(s) {
    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    	return regexp.test(s);
    }
    
    $scope.testWelcome = function(session){
        $ionicPopup.show({
            template:
                        '<div class="list">'+
                        '<label class="item item-input item-select">'+
                            '<span class="input-label">'+
                                'Select a Person'+
                            '</span>'+
                            '<select class="form-control margin-bottom" ng-model="data.name" ng-options="person as person.name for person in visitors"><option></option></select>'+
                        '</label>'+
                        '</div>',
            title: 'Test',
            scope: $scope,
           buttons: [
                {
                    text: '<b>Send Random Data</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        
                        if(!$scope.data.name){
                            Toast.show("No name selected", 100);
                        }else{
                            if ( $scope.data.name.favcoffee) {
                                favcoffee = $scope.data.name.favcoffee;
                            }
                            if ( $scope.data.name.favcoffe) {
                                favcoffee = $scope.data.name.favcoffe;
                            }
                            var visitor = $scope.data.name;
                            $http.post(API_URL + '/remotewelcome', { 
                                    tagId : visitor.id,
                                    zonefrom : "IoT",
                                    zoneto : session.socketid
                                }
                            ).then(function(response) {
                                 Toast.show("Sending ....", 1);
                              }, function(response) {
                                  console.log(response);
                                  Toast.show(response.statusText + " "+ response.data.error, 30);
                             });
                            
                        }
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    }
    $scope.randomnumber={number:0};
    $scope.batchWelcome = function(session){
        $ionicPopup.show({
            template:'<div class="list"><label class="item item-input"><span class="input-label">People</span><input ng-model="randomnumber.number" type="number"></label></div>',
            title: 'Random Batch',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Send Random Data</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if(!$scope.randomnumber.number || $scope.randomnumber.number==0){
                            Toast.show("No Random Number selected", 100);
                             e.preventDefault();
                        }else{
                            var newArr=[];
                            newArr = getRandomArrayElements($scope.visitors, $scope.randomnumber.number);
                        	angular.forEach(newArr, function(visitor){
                    			if (!visitor || !visitor.name) {
                    				return;
                    			}
                    		   
                			 $http.post(API_URL + '/remotewelcome',{ 
                			        tagId : visitor.id,
                                    zonefrom : "IoT",
                                    zoneto : session.socketid
                			   }).
                                  then(function(response) {
                                     Toast.show("Sending .... " + visitor.name, 1);
                                  }, function(response) {
                                      console.log(response);
                                      Toast.show(response.statusText + " "+ response.data.error, 30);
                                 });
                    		});
                        }
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
    }
    
    
    function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
    return shuffled.slice(min);
}


    
        
}]);