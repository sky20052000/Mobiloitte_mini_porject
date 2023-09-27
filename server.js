require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");

// db connection 
const Connection = require("./database/connection");
Connection();
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

const passport = require("passport");
require("./middleware/fbPassport");

// set express middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(session({secret:"cats"
}));
app.use(passport.initialize());
app.use(passport.session());

// set routes 
app.use("/api/user",userRoute);
app.use("/api/post", postRoute);


///////////////////////for Facebook
function isLoggedInFb(req,res,next){
    req.user ? next():res.sendStatus(401)
}

app.get("/facebook",(req,res)=>{
    res.send('<a href="/auth/facebook">SIGN IN WITH FACEBOOK</a>')
});

app.get("/auth/facebook",
passport.authenticate('facebook',{scope:['email',"public_profile"]})
);

app.get("/facebook/callback",
     passport.authenticate('facebook',{
        successRedirect:"/profile",
        failureRedirect:"/error"
     })
);

// failure auth route
app.get("/error",(req,res)=>{
    res.send("Something went wrong!")
})

// protected route 
app.get("/profile",isLoggedInFb,(req,res)=>{
    res.send(`Hurrah! Facebook login successfully done!  ${req.user.displayName} `);
    
});


app.get("/fblogout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/facebook');
      });
})



app.listen(process.env.Port ,()=>{
    console.log(`Server listening on the:${process.env.Host}:${process.env.Port}`);
});