'use strict';

angular.module('confusionApp')
.controller('glucoseHistoryCtrl',['$scope', '$location', 'historyService', 'adviceService',function($scope, $location, historyService, adviceService) {
  $scope.redirPH = function() {
    $location.path('pHHistory');
  }
  //     app.directive('td', function() {
  //     return {
  //       link: function(scope, element, attributes){
  //          console.log("Element:", element);
  //          console.log("Attributes:", attributes);
  //       }
  //     }
  ***REMOVED***

  historyService.getData().get({id:1},function (success)  {
    console.log("Scan data retrieved successful!");
    $scope.results = success.data;
    // console.log($scope.results.length);
    var dictDate = {};
    var dictTime = {};
    var isNormal = 0;
    var isAbnormal = 0;
    for (var i = 0; i < $scope.results.length; i++) {
      // console.log($scope.results[i]);
      var currentDate = $scope.results[i].scan_date;
      // if ($scope.results[i].isNormal == 1) {
      //    console.log("Current date:", currentDate, "Loop:", i+1, "isNormal: Yes");
      // }
      // else {
      //    console.log("Current date:", currentDate, "Loop:", i+1, "isNormal: No");
      // }
      if (i < $scope.results.length - 1) {
        // console.log("Next date:",$scope.results[i+1].scan_date);
        if (currentDate == $scope.results[i+1].scan_date) {
          if ($scope.results[i].isNormal == 1) {
            isNormal++;
            // console.log("isNormal:", isNormal);
          }
          else {
            isAbnormal++;
            // console.log("isAbnormal:", isAbnormal);
          }
        }
        else {
          if ($scope.results[i].isNormal == 1) {
            isNormal++;
          }
          else {
            isAbnormal++;
          }
          if (isAbnormal >= isNormal) {
            dictDate[currentDate] = ["isAbnormal"];
          }
          else {
            dictDate[currentDate] = ["isNormal"];
          }
          // console.log("Normal count:", isNormal, "Loop:", i);
          // console.log("Abnormal count:", isAbnormal, "Loop:", i);
          isNormal = 0;
          isAbnormal = 0;
        }
      }
      else {
        if ($scope.results[i].isNormal == 1) {
          isNormal++;
        }
        else {
          isAbnormal++;
        }
        if (isAbnormal >= isNormal) {
          dictDate[currentDate] = ["isAbnormal"];
        }
        else {
          dictDate[currentDate] = ["isNormal"];
        }
      }
      // console.log(dict);
    }
    angular.forEach(dictDate, function(value, key) {
      angular.element(document).ready(function() {
        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
          },
          defaultDate: Date.now(),
          navLinks: true, // can click day/week names to navigate views
          editable: true,
          eventLimit: true, // allow "more" link when too many events
          events: [
            //    {
            //  title: 'Some title',
            //  start: value.scan_date,
            //  backgroundColor: 'red',
            //    }
          ]
        });
        // console.log("This is the key:", key);
        // console.log("This is the value:", value);
        if(value == "isAbnormal") {
          $('.fc-day[data-date="' + key + '"]').attr('style','background:rgb(255, 0, 0)');
        }
        else {
          $('.fc-day[data-date="' + key + '"]').attr('style','background:rgb(0, 255, 0)');
        }
      });
    });
  },function (err) {
    console.log("Error retrieving scan data.");
  })
}])
.controller('pHhistoryCtrl',['$scope', '$location', 'historyService' ,function($scope, $location, historyService) {
  $scope.redirGlucose = function() {
    $location.path('glucoseHistory');
  }
  var dataList = [];
  var labelsList = [];
  //  var list = [];
  //  var labels = [["Monday", "Tuesday", "Wednesday", "Thursday"], ["Monday", "Tuesday", "Wednesday", "Thursday"]];
  //  var data = [[20, 30, 15, 50], [0, 10, 20, 30]];
  var labels = [];
  var data = [];

  historyService.getData().get({id:1},function (success) {
    console.log("Scan data retrieved successful!");
    $scope.results = success.data;
    angular.forEach($scope.results, function(value, key) {
      if (value.parameter_id == 2) {
        var jsondata = JSON.parse(value.reading_json);
        var time = value.scan_time;
        dataList.push(jsondata.pH);
        labelsList.push(time);
      }
    });
    data.push(dataList);
    labels.push(labelsList);
    console.log(dataList);
    console.log(labelsList);

    $scope.filter = function(number) {
      const CHART = document.getElementById("chartID");
      var chart = new Chart(CHART, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
          labels: labels[number],
          datasets: [
            {
              showLine: true,
              label: "pH",
              data: data[number],
            },
          ]
        },
        // Configuration options go here
        options: {
          scales: {
            xAxes: [{
              scaleLabel: {
                display:true,
                labelString: 'Time of Scan'
              }
            }],
            yAxes: [{
              ticks: {
                lineAtIndex: 6,
                beginAtZero: true
              }
            }]
          },
          annotation: {
            annotations: [{
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 6,
              borderColor: 'rgb(0, 255, 0)',
              borderWidth: 4
            }]
          }
          // bands: {
          //        yValue: 10   ,                // The threshold value on the yAxis (default is false)
          //        bandLine: {                // The display properties of the threshold line
          //            stroke: 0.01,
          //            colour: 'rgba(0, 0, 0, 1.000)',
          //            type: 'solid',            // 'solid' or 'dashed'
          //            label: '',
          //            fontSize: '12',
          //            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          //            fontStyle: 'normal'
          //        },
          //        belowThresholdColour: [      // An array of the colors that describes the below threshold colour to use the above threshold color is inherited from the dataset
          //            'rgba(0, 255, 0, 1.000)'
          //        ]
          //    }
        }
      });
      // console.log(labels[number]);
      // console.log(data[number]);
      // list.push(chart);
      // console.log("Inside Loop: " + i + " Data: " + list[number]);
    }
  },function (err) {
    console.log("Error retrieving scan data.");
  })


}])
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
  console.log("value in rootScope ",$rootScope.userinfo);
  $scope.verifiedUser = $rootScope.userinfo.clinic_id ? true : false;
  $scope.username = $rootScope.userinfo ? $rootScope.userinfo.clinic_name : "";
  $scope.data = {username:"",password:""};
  $scope.logout = function () {
    accountFactory.logout().get(function () {
      console.log("inside logout callback");
      ////AuthenticationService.verifiedUser = null;
      $scope.error="";
      $rootScope.userinfo = {};
      $scope.verifiedUser = false;
      AuthenticationService.ClearCredentials();
    });
  }

  // if($rootScope.userinfo.currentUser){
  //   console.log("user info found in cookie");
  //   ////AuthenticationService.verifiedUser = $rootScope.userinfo.currentUser.username;
  //   $scope.username=$rootScope.userinfo.currentUser.username;
  // }
  // $scope.username = "hello";
  $scope.login = function () {
    $scope.dataLoading = true;
    AuthenticationService.Login($scope.data.username, $scope.data.password, function(response) {
      if(response.data.success) {
        //console.log($rootScope.userinfo.currentUser.username);
        console.log(response);
        $scope.username = response.data.user.clinic_name;
        // $rootScope.userinfo = response.data.user; this is done at SetCredentials function
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
.controller('AppointmentController', ['$scope','$rootScope', 'AuthenticationService',
'appointmentService' ,'adviceService','$location',
function($scope,$rootScope,AuthenticationService,appointmentService,
  adviceService,$location) {

    // console.log("user is "+AuthenticationService.verifiedUser);
    var userId = $rootScope.userinfo.clinic_id;
    $scope.confirmed=[] ;
    $scope.pending=[] ;
    $scope.confirmData = {date:"",time:"",clinic_id:AuthenticationService.verifiedUser.clinic_id};
    $scope.PassID = function(value){
      // console.log("data got, ",value);
      adviceService.ID= value.user_id;
      adviceService.appointment = value.appointment_id;
      adviceService.Name= value.name;
      if(value.feedback_id){
        adviceService.feedback_id = value.feedback_id;
        $location.path("ViewFeedback");
      }
      else if(!value.is_confirmed){
        $location.path("ConfirmAppointment");
      }
      else if(value.is_confirmed){
        $location.path("advice");
      }
    };
    $scope.historyID = function() {
      $location.path('glucoseHistory');
    };
    $scope.history = function (appointment_id) {
      // $('#confirmModal').data('bs.modal').handleUpdate();
      $location.path("history");
    }
    $scope.showConfirmModal = function (appointment_id) {
      // $('#confirmModal').data('bs.modal').handleUpdate();

      $scope.confirmData.appointment_id = appointment_id;
      $("#confirmModal").modal();
    }
    $scope.confirm = function () {
      // console.log($scope.confirmData);
      appointmentService.LoadPatient().update($scope.confirmData,function (res) {
        if(res.success){
          // console.log("$scope.patients", $scope.patients);
          for (var i = 0; i < $scope.patients; i++) {
            if($scope.patients[i].appointment_id == $scope.confirmData.appointment_id){
              $scope.patients[i].appointment_time = $scope.confirmData.time;
              $scope.patients[i].appointment_date = $scope.confirmData.date;
              $scope.patients[i].is_confirmed = true;
              $scope.apply();
              confirmed.push($scope.patients[i]);
            }
          }
        }
      });
    }

    $scope.onChanged=function(val){
      if(val==0 ){
        $scope.patients=all;
        // console.log(all);
      }else if(val ==1 ){
        $scope.patients=pending
        // console.log(pending);
      }else if(val==2){
        $scope.patients=confirmed;
        // console.log(confirmed);
      }
    }
    var all=[];
    var confirmed=[];
    var pending = [];
    var id = null;

    appointmentService.LoadPatient().get({id:userId},function(success)   {
      console.log("patient retrieval success");
      $scope.time = null;
      $scope.patients=success.data;
      all=success.data;
      // console.log("patients in scope, ",$scope.patients);
      // console.log("all patients",all);
      angular.forEach($scope.patients, function(value, key) {
        // console.log(key );
        // console.log(value.user_id );
        id =value.user_id
        if(value.is_confirmed==false||value.is_confirmed==null){
          pending.push(value);
          // console.log($scope.pending);
          $scope.time = "Waiting for doctor to confirm";
          // console.log($scope.time);

        }
        else{
          confirmed.push(value);
          // console.log($scope.confirmed);
        }
      });

    },function (err) {
      console.log("patient retrieval error");

    })
  }])
  .controller('ConfirmAppointmentCtrl',['$scope', 'appointmentService','$location', 'adviceService',function($scope,appointmentService,$location,adviceService) {

    $scope.patients = appointmentService.user ;
    // console.log( $scope.patients);
    $scope.confirmData = {};
    if(adviceService.appointment){
      $scope.confirmData.appointment_id = adviceService.appointment;
    } else {
      $location.path("/appointment");   //redirect because valid appointment_id is not available
    }

    $scope.confirm = function () {
      $scope.confirmData.time = $scope.confirmData.time.format("H:MM:ss");
      $scope.confirmData.date = $scope.confirmData.date.format("yyyy-mm-dd");
      console.log("confirming appmt with data,",$scope.confirmData);
      appointmentService.LoadPatient().update($scope.confirmData,function (res) {
        if(res.success){
          console.log("$scope.patients", $scope.patients);

          for (var i = 0; i < $scope.patients; i++) {
            if($scope.patients[i].appointment_id == $scope.confirmData.appointment_id){
              $scope.patients[i].appointment_time = $scope.confirmData.time;
              $scope.patients[i].appointment_date = $scope.confirmData.date;
              $scope.patients[i].is_confirmed = true;
              $scope.apply();
              confirmed.push($scope.patients[i]);

            }
          }
          $location.path('/appointment');
        }
      });
    }
  }])
  .controller('ViewFeedbackCtrl',['$scope', '$location', 'adviceService', function($scope, $location, adviceService){
    $scope.data = {};
    $scope.data.name = adviceService.Name;
    console.log($scope.data.name);
    if(adviceService.feedback_id){
      var feedback_id = adviceService.feedback_id;
      console.log(feedback_id);
    }else{
      $location.path('/appointment');
    }
    adviceService.getfeedback().get({id:feedback_id},function (success) {
      console.log("feedback retrieval success");
      console.log(success);
      $scope.data=success.data;
    });
    $scope.back = function () {
      $location.path('/appointment');
    };
  }])
  .controller('adviceCtrl', function($scope,$location,AuthenticationService,adviceService) {
    $scope.data = {ph:"", glucose:"", patient_view:"",comment_date:"", appointment_id:""};
    if(adviceService.appointment){
      $scope.data.appointment_id = adviceService.appointment;
      $scope.data.advice_datetime = new Date();
      $scope.data.user_id = adviceService.ID;
      $scope.data.name = adviceService.Name;
    } else {
      $location.path("/appointment");   //redirect because valid appointment_id is not available
    }
    console.log($scope.data.appointment_id);
    console.log($scope.data.user_id );
    console.log($scope.data.name);
    $scope.data.clinic_id = AuthenticationService.verifiedUser.clinic_id;
    $scope.sendfeedback = function () {
      console.log($scope.data);
      adviceService.getfeedback().save($scope.data,function (success){
        console.log("In the get feedback");
        console.log(success);
        if(success.result.code == 1){
          console.log("Sucess");
          $scope.show = true;
          console.log($scope.show);
          $location.path('/appointment');
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
