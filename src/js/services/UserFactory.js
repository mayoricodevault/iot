app.factory('UserFactory', ['$http', 'API_URL', 'AuthTokenFactory', '$q', "$rootScope", function($http, API_URL, AuthTokenFactory, $q, LSFactory){
    return {
        login : login,
        logout: logout,
        getUser : getUser
    };
    
    function login(username,password) {
      return $http.post( API_URL + '/login', {
          username: username,
          password : password
      }).then(function success(response) {
         AuthTokenFactory.setToken(response.data.token);
         return response;
      });
    }
    function logout() {
        AuthTokenFactory.setToken();
    }
    function getUser() {
        if (AuthTokenFactory.isAuth) {
    
            return $http.post( API_URL + '/me');
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
    }
}]);