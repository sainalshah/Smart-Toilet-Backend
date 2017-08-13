// app/routes.js
module.exports =
{
	routes:function(app, passport) {

		// =====================================
		// HOME PAGE (with login links) ========
		// =====================================

		// =====================================
		// LOGIN ===============================
		// =====================================
		// show the login form

		app.get('/errorsignin',function(req, res) {
			//console.log(req);
			res.json({'msg':'sign in error'})
		});
		app.get('/errorsignup',function(req, res) {
			console.log("hello");
			res.json({success: false});
		});
		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/errorsignin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}),
		function(req, res) {
			console.log(req);

			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect('/');
		});
		app.post('/patientLogin', passport.authenticate('patient-local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/errorsignin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}),
		function(req, res) {
			console.log(req);

			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect('/');
		});
		// =====================================
		// SIGNUP ==============================
		// =====================================
		// show the signup form

		// process the signup form
		app.post('/signup',passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/errorsignup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
		app.post('/patientSignup',passport.authenticate('patient-local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/errorsignup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
		// =====================================
		// PROFILE SECTION =========================
		// =====================================
		// we will want this protected so you have to be logged in to visit
		// we will use route middleware to verify this (the isLoggedIn function)
		app.get('/profile', this.isLoggedIn, function(req, res) {
			console.log("from /profile");
			curUser = req.user;
			curUser.password = '';
			console.log(curUser);
			res.json({
				user : curUser, // get the user out of session and pass to template
				success: true
			});
		});

		// =====================================
		// LOGOUT ==============================
		// =====================================
		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});
	},

	// route middleware to make sure
	isLoggedIn: function (req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated()){
			console.log("users isLoggedIn, authenticated");
		return next();
	}

		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}
