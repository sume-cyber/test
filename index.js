const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();
const app = express();
const PORT=process.env.PORT||8080
// Middleware for session handling
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would typically find or create a user in your database
    return done(null, profile);
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', 
    { failureRedirect: '/login/failed', 
      successRedirect:'/login/success'
    }),
  
);

app.get("/login/success", (req, res) => {
  if(req.user){
    res.status(200).json({
        error:false,
        message:"Successfully Login",
        user:req.user,
    })
  }else{
    res.status(403).json({
        error:true,
        message:"Not Authorized",
    })
  }
});
app.get("/login/failed",(req,res)=>{
    res.status(401).json({
        error:true,
        message:"Login Faillier",
    });
});

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Sign In with Google</a>');
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
