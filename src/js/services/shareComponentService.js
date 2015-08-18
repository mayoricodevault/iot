app.service('shareComponentService', function() {
  var device = {};

  var addDevice = function(newObj) {
      device = newObj;
  };

  var getDevice = function(){
      return device;
  };

  return {
    addDevice: addDevice,
    getDevice: getDevice
  };

});