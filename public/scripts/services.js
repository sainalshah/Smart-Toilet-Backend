'use strict';

angular.module('confusionApp')
//.constant("baseURL","https://localhost:3443/")
.constant("baseURL","https://ec2-13-228-111-202.ap-southeast-1.compute.amazonaws.com/")

.service('accountFactory', ['$resource', 'baseURL', function($resource,baseURL) {
  this.login = function () {

    return $resource(baseURL+"login/:id",null,
    {'update':{method:'PUT' }});
  };
  this.logout = function () {

    return $resource(baseURL+"logout/:id",null,
    {'update':{method:'PUT' }});
  };
  this.signUp = function () {

    return $resource(baseURL+"signup/:id",null,
    {'update':{method:'PUT' }});
  };

  // implement a function named getPromotion
  // that returns a selected promotion.
  this.getAccount = function () {

    return $resource(baseURL+"Register/:id",null,
    {'update':{method:'PUT' }});
  };

  this.getAppointment = function () {

    return $resource(baseURL+"appointment/:id",null,
    {'update':{method:'PUT' }});
  };

}])
.service('adviceService', ['$resource', 'baseURL', function($resource,baseURL) {
  var service = {};
  service.verifiedComment = {};
  this.ID = null;
  this.getfeedback = function() {
    return $resource(baseURL+"advice/:id",null,
    {'update':{method:'PUT' }});
  };
}])
.service('appointmentService', ['$resource', 'baseURL', function($resource,baseURL) {
  this.LoadPatient = function () {
    return $resource(baseURL+"appointment/:id",null,
    {'update':{method:'PUT' }});
  };

}])

.service('patientService', ['$resource', 'baseURL', function($resource,baseURL) {
  this.LoadConfirmedAppointment = function () {
    return $resource(baseURL+"patient/:id",null,
    {'update':{method:'PUT' }});
  };

}])
.service('adviceService', ['$resource', 'baseURL', function($resource,baseURL) {
  this.ID = null;
  this.getfeedback = function () {

    return $resource(baseURL+"advice/:id",null,
    {'update':{method:'PUT' }});
  };
}])
.factory('AuthenticationService',
['Base64', '$http', '$cookies', '$rootScope', '$timeout','$window',
function (Base64, $http, $cookies, $rootScope, $timeout, $window) {
  var service = {};
  service.verifiedUser = {};
  service.Login = function (username, password, callback) {

    var data = { username: username, password: password };
    console.log(data);
    $http.post('/login', { username: username, password: password })
    .then(function (response) {
      //  console.log("response is ");
      //  console.log(response);
      callback(response);
    });

  };

  // service.SetCredentials = function (username, password) {
  //   var authdata = Base64.encode(username + ':' + password);
  //
  //   $rootScope.userinfo = {
  //     currentUser: {
  //       username: username,
  //       authdata: authdata
  //     }
  //   };
  //
  //   var now = new $window.Date(),
  //   // this will set the expiration to 6 months
  //   exp = new $window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());
  //   console.log("cookie expires: "+exp);
  //   $cookies.putObject('userinfo', $rootScope.userinfo, {'expires': exp});
  // };
  service.SetCredentials = function (user) {
    service.verifiedUser = user;
    $rootScope.userinfo = user;
    console.log("service.verifiedUser is ");
    console.log(service.verifiedUser);
  };

  service.ClearCredentials = function () {
    $rootScope.userinfo = {};
    service.verifiedUser = {};
    $cookies.remove('userinfo');
    $http.defaults.headers.common.Authorization = 'Basic ';
  };

  return service;
}])

.factory('Base64', function () {
  /* jshint ignore:start */

  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };

  /* jshint ignore:end */
})

;
