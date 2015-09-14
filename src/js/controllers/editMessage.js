'use strict';

app.controller('editMessage', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','storeService','Toast', function($scope, Api, $ionicPopup, $cordovaToast, storeService,Toast) {
	$scope.messages = [];
	$scope.newmessage = storeService.jsonRead("shareData");
	console.log("new Message --> ",$scope.newmessage);
	$scope.formScope=null;
	$scope.setFormScope = function(frmMessage){
		$scope.formScope = frmMessage;
	}
	
	var dateStart = new Date($scope.newmessage.start);
	var dateEnd = new Date($scope.newmessage.end);
	
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
	
	$scope.timePickerObjectStart = {
		inputEpochTime: (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60,  //Optional
		step: 1,  //Optional
		format: 24,  //Optional
		titleLabel: '24-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackStart(val);
		}
	};
	
	$scope.timePickerObjectEnd = {
		inputEpochTime: (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60,  //Optional
		step: 1,  //Optional
		format: 24,  //Optional
		titleLabel: '24-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackEnd(val);
		}
	};
	
	function setTimeSelectedStart(hour,minute){
		$scope.startHour = hour;
	    if($scope.startHour<10)$scope.startHour='0'+$scope.startHour;
	    $scope.startMinute = minute;
	    if($scope.startMinute<10)$scope.startMinute='0'+$scope.startMinute;
	}
	
	function setTimeSelectedEnd(hour,minute){
		$scope.endHour = hour;
	    if($scope.endHour<10)$scope.endHour='0'+$scope.endHour;
	    $scope.endMinute = minute;
	    if($scope.endMinute<10)$scope.endMinute='0'+$scope.endMinute;
	}
	
	setTimeSelectedStart(dateStart.getHours(),dateStart.getMinutes())
	setTimeSelectedEnd(dateEnd.getHours(),dateEnd.getMinutes())
	
	
	function timePickerCallbackStart(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	    
	    var selectedTime = new Date(val * 1000),selected_hour,selected_minute;
	  	
	  	selected_hour = selectedTime.getUTCHours();
	  	selected_minute = selectedTime.getUTCMinutes();
	    
	    
	    var currentTime = new Date(),currentHour,currentMinute;
	    
	    currentHour = currentTime.getHours();
	    currentMinute = currentTime.getMinutes();
	    
	    if(currentHour<selected_hour){
	    	setTimeSelectedStart(selected_hour,selected_minute);
	    	$scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	setTimeSelectedEnd(selected_hour,selected_minute);		//show the time in the button
	    }else{
	    	if(currentHour==selected_hour&&currentMinute<=selected_minute){
	    		setTimeSelectedStart(selected_hour,selected_minute);
	    		$scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		setTimeSelectedEnd(selected_hour,selected_minute);	//show the time in the button
	    	}else{
	    		Toast.show("Select a valid time");
	    	}
	    }
	  }
	}
	
	function timePickerCallbackEnd(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	  	
	    var selectedTime = new Date(val * 1000),selected_hour,selected_minute;
	  	
	  	selected_hour = selectedTime.getUTCHours();
	  	selected_minute = selectedTime.getUTCMinutes();
	  	
	  	
	  	if($scope.startHour<selected_hour){
	    	setTimeSelectedEnd(selected_hour,selected_minute);
	    	$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    }else{
	    	if($scope.startHour==selected_hour&&$scope.startMinute<=selected_minute){
	    		setTimeSelectedEnd(selected_hour,selected_minute);
	    		$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	}
	    	else{
	    		Toast.show("Select a valid time");
	    	}
	    }
	  }
	}
	
	
	
	$scope.messageSubmit = function(message) {
		
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
		
		Api.Product.save({id:$scope.newproduct._id}, $scope.newproduct, 
        function(data){
        	Toast.show("Update Successful.");
			$scope.messages.push($scope.newmessage);
        },
        function(err){
        	Toast.show("System Error." + err.statusText);
			return false;
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
}]);
