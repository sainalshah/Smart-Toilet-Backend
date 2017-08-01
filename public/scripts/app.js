'use strict';

angular.module('confusionApp', ['ui.router','ngResource',
'ngRoute','ngCookies', 'chart.js'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // route for the home page
  .state('app', {
    url:'/',
    views: {
      'header': {
        templateUrl : 'views/header.html',
        controller  : 'LoginController'
      },
      'content': {
        templateUrl : 'views/home.html',
      },
      'footer': {
        templateUrl : 'views/footer.html',
      }
    }

  })
  .state('app.appointment', {
    url: 'appointment',
    views: {
      'content@': {
        templateUrl : 'views/appointment.html',
        controller  : 'AppointmentController'
      }
    }
  })
  .state('app.ViewFeedback', {
    url: 'ViewFeedback',
    views: {
      'content@': {
        templateUrl: 'views/ViewFeedback.html',
        controller: 'ViewFeedbackCtrl'
      }
    }
  })
  .state('app.ConfirmAppointment', {
    url: 'ConfirmAppointment',
    views: {
      'content@': {
        templateUrl: 'views/ConfirmAppointment.html',
        controller: 'ConfirmAppointmentCtrl'
      }
    }
  })
  .state('app.advice', {
    url: 'advice',
    views: {
      'content@': {
        templateUrl: 'views/advice.html',
        controller: 'adviceCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
})
.run(['$rootScope', '$location', '$cookies', '$http',
function ($rootScope, $location, $cookies, $http) {
  // keep user logged in after page refresh
  $rootScope.userinfo = $cookies.getObject('userinfo') || {};
  console.log("at app.js, the value in cookie is: ");
  console.log($rootScope.userinfo);
  if(typeof $rootScope.userinfo === 'string'){
    $rootScope.userinfo = JSON.parse($rootScope.userinfo);
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // redirect to login page if not logged in
    if ($location.path() !== '/' && !$rootScope.userinfo.clinic_id) {
      $location.path('/');
    }
  });
}])
;
