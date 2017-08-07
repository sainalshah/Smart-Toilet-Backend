// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
var connection = mysql.createConnection({
***REMOVED***
***REMOVED***
***REMOVED***
  port     : 3306,
  database : "fyp"
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database from passport.js');
});
// expose this function to our app using module.exports
module.exports = function(passport) {


  passport.serializeUser(function(user, done) {
    console.log("user to serialize");
    console.log(user);
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
    console.log("the id is: ");
    console.log(user);
    // connection.query("SELECT * FROM Clinic WHERE clinic_id = ? ",[id], function(err, rows){
    if(user.role_id==1){
      connection.query("SELECT * FROM User WHERE user_id = ? ",[user.user_id], function(err, rows){
        if(err){
          throw err;
        }

        done(err, rows[0]);
      });
    }else{


      connection.query("SELECT * FROM Clinic WHERE clinic_id = ? ",[user.clinic_id], function(err, rows){
        if(err){
          throw err;
        }

        done(err, rows[0]);
      });
    }
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      //console.log(req);
      console.log("the authenticate.js, signing up user");

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      connection.query("SELECT * FROM Clinic WHERE clinic_email = ?",[email], function(err, rows) {
        if (err)
        return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          // if there is no user with that username
          // create the user
          var newUserMysql = {
            username: email,
            password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
            phone_number: req.body.contact,
            name : req.body.username,
            role_id: req.body.role_id,
            address: req.body.address,
            postal: req.body.postal
          };
          console.log(newUserMysql);
          var insertQuery = "INSERT INTO Clinic ( clinic_email, password, phone_number,clinic_name,"+
          "role_id,clinic_address,postal_code ) values (?,?,?,?,?,?,?)";

          connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,
            newUserMysql.phone_number,newUserMysql.name,newUserMysql.role_id,newUserMysql.address,newUserMysql.postal],
            function(err, rows) {
              if(err){
                throw err;
              }
              newUserMysql.clinic_id = rows.insertId;
              console.log("new user created, with id: "+newUserMysql.clinic_id);
              newUserMysql.role_id = 2;
              return done(null, newUserMysql);
            });
          }
        });
      })
    );

    passport.use(
      'local-login',
      new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) { // callback with email and password from our form
        console.log("the authenticate.js, logging in user");
        connection.query("SELECT * FROM Clinic WHERE clinic_email = ?",[username], function(err, rows){

          if (err)
          return done(err);
          if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          }

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          req.user_data=rows[0];
          req.user_data.password="";
          rows[0].role_id = 2;
          return done(null, rows[0]);
        });
      })
    );

    passport.use(
      'patient-local-signup',
      new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        //console.log(req);
        console.log("the authenticate.js, signing up ionic user");

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM User WHERE user_email = ?",[username], function(err, rows) {
          if (err)
          return done(err);
          if (rows.length) {
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
          } else {
            // if there is no user with that username
            // create the user
            var newUserMysql = {
              username: username,
              password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
              phone_number: req.body.contact,
              name : req.body.name,
              role_id: req.body.role_id,
              postal_code : req.body.postal_code
            };
            console.log(newUserMysql);
            var insertQuery = "INSERT INTO User ( user_email, password, phone_number,name,"+
            "role_id,postal_code,coordinates ) values (?,?,?,?,?,?,?)";

            connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,newUserMysql.phone_number,newUserMysql.name,newUserMysql.role_id,newUserMysql.postal_code],
              function(err, rows) {
                if(err){
                  throw err;
                }
                newUserMysql.user_id = rows.insertId;
                setDefaultSetting = `insert into Parameter_settings_for_user values(?,?,?)`;
                var defaultSetting = 3;
                for (var parameter_id = 1; parameter_id <= 2; parameter_id++) {
                  console.log("USING values",parameter_id,newUserMysql.user_id,defaultSetting);
                  connection.query(setDefaultSetting,[parameter_id,newUserMysql.user_id,defaultSetting],function (err, rows) {
                    if(err)
                    throw err;
                    console.log("parameter set");
                  });
                }
                console.log("new user created, with id: "+newUserMysql.user_id);
                return done(null, newUserMysql);
              });
            }
          });
        })
      );
      passport.use(
        'patient-local-login',
        new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
          console.log("the authenticate.js, logging in ionic user");
          connection.query("SELECT * FROM User WHERE user_email = ?",[username], function(err, rows){

            if (err)
            return done(err);
            if (!rows.length) {
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            req.user_data=rows[0];
            req.user_data.password="";
            rows[0].role_id = 1;
            return done(null, rows[0]);
          });
        })
      );
    };
