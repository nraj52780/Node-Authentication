const express= require('express');
const passport= require('passport');
const mongoose=require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
//--------------------------
var app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.sendFile('auth.html',{root: __dirname});
})

app.listen(3000,()=>
console.log('app listening on port 3000')
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/success',(req,res)=> 
res.send("Aa gye, ab jaoge kaise!!!")
);

app.get('/error',(req,res)=> res.send('error!!!!!!!!'));
//-------------------------------
// serialization and deserialization!!!

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
//------------------------
// connecting mongodb---

mongoose.connect('mongodb://localhost/MyDatabase');

const Schema= mongoose.Schema;

const userDetail= new Schema({
    username: String,
    password: String
});

// 
const  userDetails= mongoose.model('userInfo',userDetail,'userInfo');

//--------------------
// local strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        userDetails.findOne({
          username: username
        }, function(err, user) {
          if (err) {
            return done(err);
          }
  
          if (!user) {
            return done(null, false);
          }
  
          if (user.password != password) {
            return done(null, false);
          }
          return done(null, user);
        });
    }
  ));
  
  app.post('/',
    passport.authenticate('local', { failureRedirect: '/error' }),
    function(req, res) {
      res.redirect('/success?username='+req.user.username);
    });



