var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user');
// var localStorage = require('node-localstorage')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/signup', (req, res, next)=>{
    // res.render('signup');
    res.json({"message": "time to signup"});
})

//signup payload being sent
//need radio buttons for admin/not... same as login
/* GET home page. */
router.post('/signup', function (req, res, next) {
    //construct mongoose query to create new user
    //dont save pwd, construct salt and hash
    //generate token (or make usr route to login, gen on login not signup)
    //mongoose query new user
    console.log(req.body);
    let userData = {
        isAdmin: false,
        ...req.body
    }
    // let userDAO = new User(req.body);
    let userDAO = new User(userData);

    console.log(userDAO);
    //get salt and hash for new password
    userDAO.setPassword(req.body.password);
    userDAO.save((err, data)=>{
        //send resp to login
        if(!err){
            const status = {
                msg: 'user account created successfully'
            }
            res.json(status);
        }else{
            res.json(err);
        }
    })
    
});

//log in: slide 41 of slide
router.get('/dashboard', function(req, res, next){
    res.json(req.body)
})


//signin payload being sent
router.post('/login', function (req, res, next) {
    console.log(req.body);
    //passport to validate user creds
    //refer passportConfig.js
    passport.authenticate('local', function(err, user){
        if(err){
            console.log('some error occured');
            res.json(err);
        }
        //find one in passportConfig
        //if usuer found... should not expose salt and hash
        if(user){
            //want a token to return now not all info
            //using json web token

            let loggedInUserInfo = {
                email: user.email,
                token: user.generateJWT()
            }
            localStorage.setItem('authtoken', loggedInUserInfo.token)
            var token = localStorage.getItem('authtoken');
            console.log("token>", token)

            res.json(loggedInUserInfo);
            // res.render('dashboard');
            //or 
            // res.redirect('/dashboard')
        }
    })(req, res);
    //^^above: passing in req and response
})

module.exports = router;
