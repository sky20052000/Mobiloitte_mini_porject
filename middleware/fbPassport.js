const passport = require("passport");
   require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.clientIdFb,
    clientSecret:process.env.clientSecretFb,
    callbackURL: "http://localhost:7000/api/user/facebook/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done,) {
       console.log(profile,"nnnn")
  return done(null,profile)
  }
));

passport.serializeUser(function(user,done){
    done(null,user)
});

passport.deserializeUser(function(obj,done){
    done(null,obj)
});