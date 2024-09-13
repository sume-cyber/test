const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
// Use the session middleware
app.use(session({ 
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}))

// Access the session as req.session
app.get('/', function(req, res, next) {
  res.send(`User Logined <a href='/login'>LOGIN</a>`)
  
})

app.get('/login',(req,res)=>{
  res.cookie("connection_id","1230");
  res.status(200);
  res.send(`User Logined <a href='/logout'>LOGOUT</a>`)
});
app.get('/logout',(req,res)=>{
  res.session.destroy(erro=>{

  });
})



app.listen(3000, () => {
  console.log('Server is running on port 3000');
     });
