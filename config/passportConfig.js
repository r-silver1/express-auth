var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var User = mongoose.model('User');
var User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
function(email, password, done){
    User.findOne({email: email}, function(err, user){
        if(err) {return done(err);}
        if(!user){
            return done(null, false, {
                message: 'User invalid'
            });
        }
        if(!user.validatePassword(password)){
            return done(null, false, {
                message: 'User or Password invalid'
            })
        }
        return done(null, user);
    })
}))
