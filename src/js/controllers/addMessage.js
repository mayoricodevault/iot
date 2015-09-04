'use strict';

app.controller('addMessage', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast','$http', 'API_URL', function($scope, Api, $ionicPopup, $cordovaToast,Toast,$http,API_URL) {
    
    
    /*$scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefresh();
    });*/   
    
	//$scope.formScope=null;
	
	$scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-assertive',  //Optional
      todayButtonType : 'button-assertive',  //Optional
      closeButtonType : 'button-assertive',  //Optional
      inputDate: new Date(),    //Optional
      mondayFirst: true,    //Optional
      disabledDates: disabledDates, //Optional
      weekDaysList: weekDaysList,   //Optional
      monthList: monthList, //Optional
      templateType: 'popup', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(),   //Optional
      to: new Date(2030, 8, 25),    //Optional
      callback: function (val) {    //Mandatory
        datePickerCallback(val);
      }
    };
    
    var disabledDates = [];
    var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
    var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    var datePickerCallback = function (val) {
	  if (typeof(val) === 'undefined') {
	    console.log('No date selected');
	  } else {
	  	$scope.datepickerObject.inputDate=val;
	  }
	};
	
	$scope.startHour="";$scope.startMinute="";
	$scope.endHour="";$scope.endMinute="";
	
	$scope.timePickerObjectStart = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
		step: 1,  //Optional
		format: 12,  //Optional
		titleLabel: '12-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackStart(val);
		}
	};
	
	$scope.timePickerObjectEnd = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
		step: 1,  //Optional
		format: 12,  //Optional
		titleLabel: '12-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackEnd(val);
		}
	};
	
	function timePickerCallbackStart(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	    var selectedTime = new Date(val * 1000);
	  	
	    $scope.startHour = selectedTime.getUTCHours();
	    if($scope.startHour<10)$scope.startHour='0'+$scope.startHour;
	    $scope.startMinute = selectedTime.getUTCMinutes();
	    if($scope.startMinute<10)$scope.startMinute='0'+$scope.startMinute;
	  }
	}
	
	function timePickerCallbackEnd(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	    var selectedTime = new Date(val * 1000);
	  	
	    $scope.endHour = selectedTime.getUTCHours();
	    if($scope.endHour<10)$scope.endHour='0'+$scope.endHour;
	    $scope.endMinute = selectedTime.getUTCMinutes();
	    if($scope.endMinute<10)$scope.endMinute='0'+$scope.endMinute;
	  }
	}
	
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	}
	
	$scope.messageSubmit = function(message) {
		//console.log("message --> ",message);
		
		if(typeof message=='undefined'||!message.text) {
			Toast.show("The field Text is required.");
			return;
		}
		if(!message.expositor) {
			Toast.show("The field Expositor is required.");
			return;
		}
		
		if(!$scope.startHour) {
			Toast.show("The start time is required.");
			return;
		}
		
		if(!$scope.endHour){
			Toast.show("The end time is required.");
			return;
		}
		
		if($scope.startHour<=$scope.endHour&&$scope.startMinute<=$scope.endMinute){}
		else{
			Toast.show("Please enter a valid time");
			return;
		}
		
		var month = $scope.datepickerObject.inputDate.getUTCMonth() + 1; //months from 1-12
		var day = $scope.datepickerObject.inputDate.getUTCDate();
		var year = $scope.datepickerObject.inputDate.getUTCFullYear();
		
		var startTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.startHour+":"+$scope.startMinute,"YYYY-MM-DD HH:mm");
		var endTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.endHour+":"+$scope.endMinute,"YYYY-MM-DD HH:mm");
	
		var message = {
			text: message.text,
			expositor: message.expositor,
			start: startTimeStamp,
			end: endTimeStamp
		}
        
        console.log("message: ",message);
        
		$http.post(API_URL + '/add-message', { message: message }).
			then(function(response) {
				Toast.show("Sending Request....", 30);
				//$scope.new_person=[];
			}, function(response) {
				Toast.show(response.statusText + " "+ response.data.error, 30);
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
	 
	 
	 function doRefresh() {
	 	//$scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
	 }
	 
	 $scope.doRefresh = function() {
       // doRefresh();
    }
	 
}]);
