'use strict';

angular.module('confusionApp')

//
.controller('LoginController',
['$scope', '$rootScope', '$location', 'AuthenticationService','accountFactory',
function ($scope, $rootScope, $location, AuthenticationService,accountFactory) {
  // reset login status
  //AuthenticationService.ClearCredentials();
  // console.log("at controller.js, the value in cookie is: ");
  // console.log($rootScope.userinfo);
  $scope.isActive = function(route) {
    return route === $location.path();
  }
  $scope.error="";
  $scope.verifiedUser = false;

  $scope.data = {username:"",password:""};
  $scope.logout = function () {
    accountFactory.logout().get(function () {
      console.log("inside logout callback");
      ////AuthenticationService.verifiedUser = null;
      $scope.error="";
      $scope.verifiedUser = false;
      AuthenticationService.ClearCredentials();
    });
  }

  if($rootScope.userinfo.currentUser){
    console.log("user info found in cookie");
    ////AuthenticationService.verifiedUser = $rootScope.userinfo.currentUser.username;
    $scope.username=$rootScope.userinfo.currentUser.username;
  }
  $scope.login = function () {
    $scope.dataLoading = true;
    AuthenticationService.Login($scope.data.username, $scope.data.password, function(response) {
      if(response.data.success) {
        //console.log($rootScope.userinfo.currentUser.username);
        $scope.dataLoading = false;
        $scope.verifiedUser = true;
        console.log("login success");
        AuthenticationService.SetCredentials(response.data.user);
        console.log(response);
        ////AuthenticationService.verifiedUser = response.data.user;
        $location.path('/appointment');
      } else {
        $scope.error = response.message;
        $scope.dataLoading = false;
      }
    });
  };
  $(document).ready(function () {
    var trigger = $('.hamburger'),
    overlay = $('.overlay'),
    isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

    function hamburger_cross() {

      if (isClosed == true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
    }

    $('[data-toggle="offcanvas"]').click(function () {
      console.log("in the toggler");
      $('#wrapper').toggleClass('toggled');
    });
  });
}])
.controller('AppointmentController', ['$scope','$rootScope', 'AuthenticationService', 'appointmentService' ,'adviceService','$location',function($scope,$rootScope,AuthenticationService,appointmentService,adviceService,$location) {

  console.log("user is "+AuthenticationService.verifiedUser);
  var userId = $rootScope.userinfo.clinic_id;
  $scope.confirmed=[] ;
  $scope.pending=[] ;
  $scope.confirmData = {date:"",time:"",clinic_id:AuthenticationService.verifiedUser.clinic_id};
  $scope.PassID = function(value){
    adviceService.ID= value.user_id;
    if(value.is_confirmed){
      $location.path("advice");
    }
  };
  $scope.showConfirmModal = function (appointment_id) {
    // $('#confirmModal').data('bs.modal').handleUpdate();

      $scope.confirmData.appointment_id = appointment_id;
    $("#confirmModal").modal();
  }
  $scope.confirm = function () {
    console.log($scope.confirmData);
    appointmentService.LoadPatient().update($scope.confirmData);
  }

  $scope.onChanged=function(val){
    if(val==0 ){
      $scope.patients=all;
      console.log(all);
    }else if(val ==1 ){
      $scope.patients=pending
      console.log(pending);
    }else if(val==2){
      $scope.patients=confirmed
      console.log(confirmed);
    }
  }
  var all=[];
  var confirmed=[];
  var pending = [];
  var id = null;

  appointmentService.LoadPatient().get({id:userId},function (success) {
    console.log("patient retrieval success");

    $scope.patients=success.data;
    all=success.data;
    console.log("all patients",all);
    angular.forEach($scope.patients, function(value, key) {
      console.log(key );
      console.log(value.user_id );
      id =value.user_id
      if(value.is_confirmed==false||value.is_confirmed==null){
        pending.push(value);
        console.log($scope.pending);
      }
      else{
        confirmed.push(value);
        console.log($scope.confirmed);
      }
    });

  },function (err) {
    console.log("patient retrieval error");

  })
}])

.controller('adviceCtrl', function($scope,$location,adviceService) {
  $scope.data = {hydration_value:"", ph_value:"", glucose_value:"", clinic_name:"SGH", hydrationadvice_data:"", glucoseadvice_data:"", phadvice_data:"", user_name:"Darrel", clinic_id:"",advice_datetime:""};
  $scope.data.advice_datetime = new Date();
  $scope.data.user_id = 2;
  $scope.data.clinic_id = 2;
  $scope.sendAdvice = function () {
    console.log($scope.data);
    adviceService.getAdvice().save($scope.data,function (success){
      console.log(success);
      $scope.error=success;
      console.log(success);
      $scope.error=success;
      if(success.code == 0){
        console.log("here");
        $location.path('/');
      }
    },
    function (error) {
      console.log(error.msg);
      $scope.error=error;
    });
  }
})
.controller('RegisterController',['$scope','accountFactory', 'AuthenticationService', function($scope,accountFactory,AuthenticationService) {
  $scope.signUpSuccess = false;
  $scope.showUser = function () {
    console.log($scope.verifiedUser);
    console.log(AuthenticationService.verifiedUser);
  }
  $scope.verifiedUser = AuthenticationService.verifiedUser;
  $scope.data = {username:"",password:"",contact:"",email:"",role_id:2,address:"",postal:""};
  $scope.register = function () {
    console.log($scope.data);
    console.log("user is verified: "+$scope.verifiedUser);
    accountFactory.signUp().save($scope.data,function(response){
      console.log(response);
      if(response.success){
        console.log("status is "+response.success)
        $scope.signUpSuccess = true;
        $scope.msg = "You've successfull registered. Try your first login";
      }
      else{
        $scope.signUpSuccess = false;
        $scope.msg = "Error signing up";
      }
    });
  }
}])

;
