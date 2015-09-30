'use strict';

app.controller('addMessage', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','Toast','$http', 'API_URL', function($scope, Api, $ionicPopup, $cordovaToast,Toast,$http,API_URL) {
    
    
    /*$scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
        doRefresh();
    });*/   
    
	//$scope.formScope=null;
	$scope.newmessage = {
		text:"",
		expositor:""
	};
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
      to: new Date(2050, 8, 25),    //Optional
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
	
	function getCurrentTime(){
		return (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60;
	}
	
	$scope.startHour="";$scope.startMinute="";
	$scope.endHour="";$scope.endMinute="";
	
	$scope.timePickerObjectStart = {
		inputEpochTime:   getCurrentTime(),//Optional
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
		inputEpochTime: getCurrentTime(),  //Optional
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
	    	//$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	//setTimeSelectedEnd(selected_hour,selected_minute);		//show the time in the button
	    }else{
	    	if(currentHour==selected_hour&&currentMinute<=selected_minute){
	    		setTimeSelectedStart(selected_hour,selected_minute);
	    		$scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		//$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		//setTimeSelectedEnd(selected_hour,selected_minute);	//show the time in the button
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
	
	$scope.setFormScope = function(frmDevice){
		$scope.formScope = frmDevice;
	};
	
	$scope.messageSubmit = function(message) {
		//console.log("message --> ",message);
		
		if(typeof message=='undefined'||!message.text) {
			Toast.show("The field Text is required.");
			return;
		}
		if(!message.expositor) {
			Toast.show("The field Presenter is required.");
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
		
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		
		
		// console.log(year+"<="+$scope.datepickerObject.inputDate.getFullYear()+"  "+month+"<="+($scope.datepickerObject.inputDate.getMonth()+1)+"  "+day+"<="+$scope.datepickerObject.inputDate.getDate());
		
		if(year<=$scope.datepickerObject.inputDate.getFullYear()&&month<=$scope.datepickerObject.inputDate.getMonth()+1&&day<=$scope.datepickerObject.inputDate.getDate()){}
		else{
			Toast.show("Please enter a valid Date");
			return;
		}
		
		var currentHour=(new Date()).getHours(),currentMinute=(new Date()).getMinutes();
		
		if(currentHour<$scope.startHour){}
		else{
			if(currentHour==$scope.startHour&&currentMinute<=$scope.startMinute){}
			else {
				Toast.show("Please enter a valid time");
				return;
			}
		}
		
		if($scope.startHour<$scope.endHour){}
		else{
			if($scope.startHour==$scope.endHour&&$scope.startMinute<=$scope.endMinute){}
			else{
				Toast.show("Please enter a valid time");
				return;
			}
		}
		
		var month = $scope.datepickerObject.inputDate.getUTCMonth() + 1; //months from 1-12
		var day = $scope.datepickerObject.inputDate.getUTCDate();
		var year = $scope.datepickerObject.inputDate.getUTCFullYear();
		
		var startTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.startHour+":"+$scope.startMinute,"YYYY-MM-DD HH:mm");
		var endTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.endHour+":"+$scope.endMinute,"YYYY-MM-DD HH:mm");
	
		message = {
			text: message.text,
			expositor: message.expositor,
			start: startTimeStamp,
			end: endTimeStamp
		};
        
        console.log("message: ",message);
        
		$http.post(API_URL + '/add-message', { message: message }).
			then(function(response) {
				Toast.show("Sending Request....", 30);
				
				$scope.newmessage = {
					text:"",
					expositor:""
				};
				$scope.datepickerObject.inputDate = new Date();
				$scope.startHour = "";
				$scope.startMinute = "";
				$scope.endHour = "";
				$scope.endMinute = "";
				$scope.timePickerObjectStart.inputEpochTime= (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60;  //Optional
				$scope.timePickerObjectEnd.inputEpochTime= (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60;  //Optional
				//$scope.new_person=[];
			}, function(response) {
				Toast.show(response.statusText + " "+ response.data.error, 30);
		});
	
	};
	
	$scope.setTime = function(){
		$scope.timePickerObjectStart.inputEpochTime = getCurrentTime();
		$scope.timePickerObjectEnd.inputEpochTime = getCurrentTime();
	}
	$scope.setDate = function(){
		$scope.datepickerObject.inputDate = new Date();
		$scope.datepickerObject.from = new Date();
	}

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
