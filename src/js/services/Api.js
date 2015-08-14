app.factory('Api', ['$resource', function($resource){
    return {
        Device: $resource('/api/devices/:id', {id: '@id'})
    }
}]);