'use strict';

var app = angular.module('iot', ['ionic','ngCordova','chart.js', 'btford.socket-io','ngResource', 'firebase'])

app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  
  $stateProvider
    .state('router', {
      url: "/route",
      abstract: true,
      templateUrl: "templates/side-menu-left.html"
    })
    .state('router.dashboard', {
      url: "/dashboard",
	  	abstract: true,
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html",
          controller: 'Dashboard',
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.dashboard.home', {
      url: "/home",
      views: {
        'home-tab' :{
          templateUrl: "templates/home.html",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.dashboard.favorites', {
      url: "/favorites",
      views: {
        'favorites-tab' :{
          templateUrl: "templates/favorites.html",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.dashboard.settings', {
      url: "/settings",
      views: {
        'settings-tab' :{
          templateUrl: "templates/settings.html",
          controller: 'settings',
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.devices', {
      url: "/devices",
      views: {
        'menuContent' :{
          templateUrl: "templates/devices.html",
          controller: "deviceCtrl",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.people', {
      url: "/people",
      views: {
        'menuContent' :{
          templateUrl: "templates/people.html",
          controller: "people",
          resolve: { authenticate: authenticate }
        }
      }
    })    
	.state('router.device', {
      url: "/device",
      views: {
        'menuContent' :{
          templateUrl: "templates/device-single.html",
          controller: "deviceCtrl",
          resolve: { authenticate: authenticate }
        }
      }
    })
  .state('router.editdevice', {
      url: "/editdevice",
      views: {
        'menuContent' :{
          templateUrl: "templates/edit-device.html",
          controller: "editDevice",
          resolve: { authenticate: authenticate }
        }
      }
    })
  .state('router.editserver', {
      url: "/editserver",
      views: {
        'menuContent' :{
          templateUrl: "templates/edit-server.html",
          controller: "editServer",
          resolve: { authenticate: authenticate }
        }
      }
    })    
	.state('router.locations', {
      url: "/locations",
      views: {
        'menuContent' :{
          templateUrl: "templates/locations.html",
          controller:"locations",
          resolve: { authenticate: authenticate }
        }
      }
    })
  .state('router.servers', {
      url: "/servers",
      views: {
        'menuContent' :{
          templateUrl: "templates/servers.html",
          controller:"servers",
          resolve: { authenticate: authenticate }
        }
      }
    })    
  .state('router.products', {
    url: "/products",
    views: {
      'menuContent' :{
        templateUrl: "templates/products.html",
        controller: "productCtrl",
        resolve: { authenticate: authenticate }
      }
    }
  })
  .state('router.editproduct', {
    url: "/editproduct",
    views: {
      'menuContent' :{
        templateUrl: "templates/edit-product.html",
        controller: "editProduct",
        resolve: { authenticate: authenticate }
      }
    }
  })
  .state('router.product', {
    url: "/product",
    views: {
      'menuContent' :{
        templateUrl: "templates/product-single.html",
        controller: "productCtrl",
        resolve: { authenticate: authenticate }
      }
    }
  })
	.state('router.users', {
      url: "/users",
      views: {
        'menuContent' :{
          templateUrl: "templates/users.html",
          controller: "Users",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.addUser', {
      url: "/add-user",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-user.html",
          controller: "addUser",
          resolve: { authenticate: authenticate }
        }
      }
    })
    .state('router.edituser', {
      url: "/edit-user",
      views: {
        'menuContent' :{
          templateUrl: "templates/edit-user.html",
          controller: "editUser",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.addDevice', {
      url: "/add-device",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-device.html",
          controller: "addDevice",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.addLocation', {
      url: "/add-location",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-location.html",
          controller: "locations",
          resolve: { authenticate: authenticate }
        }
      }
    })
	.state('router.editLocation', {
      url: "/edit-location",
      views: {
        'menuContent' :{
          templateUrl: "templates/edit-location.html",
          controller:"editLocation",
          resolve: { authenticate: authenticate }
        }
      }
    })       
  .state('router.addProduct', {
    url: "/add-product",
    views: {
      'menuContent' :{
        templateUrl: "templates/add-product.html",
        controller: "addProduct",
        resolve: { authenticate: authenticate }
      }
    }
  })
	.state('router.addServer', {
      url: "/add-server",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-server.html",
          controller: "addServer",
          resolve: { authenticate: authenticate }
        }
      }
    })  
	.state('intro', {
      url: "/intro",
      templateUrl: "templates/intro.html",
      controller: "Intro",
      resolve: { reroute: reroute }
    })
    
  $urlRouterProvider.otherwise("/intro");
  
  $httpProvider.interceptors.push('AuthInterceptor');
  
  function reroute($q, LSFactory , $state, $timeout) {
      if (LSFactory.getUser()) {
        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('router.dashboard.home')
        })
        // Resolve the promise successfully
      } else {
        // The next bit of code is asynchronously tricky.
        return $q.when()
      }
  }
  
  function authenticate($q, LSFactory , $state, $timeout) {
      if (LSFactory.getUser()) {
        // Resolve the promise successfully
        return $q.when()
      } else {
        // The next bit of code is asynchronously tricky.

        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('intro')
        })

        // Reject the authentication promise to prevent the state from loading
        return $q.reject()
      }
    }
})
.constant("API_URL", 'http://iottemplate-mmayorivera.c9.io')
.constant('FIREBASE_URI_SESSIONS', 'https://kxively.firebaseio.com/sessions');

app.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
});