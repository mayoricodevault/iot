app.factory('UserFactory', ['$http', 'API_URL', 'AuthTokenFactory', '$q', function($http, API_URL, AuthTokenFactory, $q){
    return {
        login : login,
        logout: logout,
        getUser : getUser,
        isAuth : isAuth
    };
    
    function isAuth() {
        if (AuthTokenFactory.getToken()) {
            return $q.resolve("ok");
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
	}
    
    function login(username,password) {
      return $http.post( API_URL + '/login', {
          username: username,
          password : password
      }).then(function success(response) {
         AuthTokenFactory.setToken(response.data.token);
         return response;
      });
    };
    function logout() {
        AuthTokenFactory.setToken();
    }
    function getUser() {
        if (AuthTokenFactory.getToken()) {
            return $http.post( API_URL + '/me');
            
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
    }
}]);