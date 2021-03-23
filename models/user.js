const mongoose = require('./mongo');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const autoIncrement = require('mongoose-auto-increment');

const User = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },  //primary key
    name: String,
    email: {
        type: String,
        unique: true
    },
    salt: String,
    hash: String,
    createdOn: {
        type: Date,
        default: Date.now()
    },
    status: Boolean,
    isAdmin: Boolean,
    isEmailVerified: Boolean

}, {strict: true});

//define util fn to gen salt and has
User.methods.setPassword = function(password){
    //options
    //node.bcrypt.js: third party
    //crypto node js: built in https://nodejs.org/api/crypto.html
    //salt.. param size: 16 bytes
    this.salt = crypto.randomBytes(16).toString('hex');
    //hash
    //many options inside
    //this: take pwd, salt, ... digest: type of alg, iterations: number of times key changed (1000) size: 512 (bytes?)
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');

}

//login util method
//will need to decrypt password, get salt and has to compare
User.methods.validatePassword = function(password){
    console.log(password);
    //already saved hash salt
    //there will be keyword salt?
    console.log(this.salt);
    console.log(this.hash);
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return this.hash == hash;
}


//note: with arrow function, this keyword wouldn't be avail, make anon function
//generate token using JWT
User.methods.generateJWT = function(){
    const today = new Date();
    const expirationDate = new Date(today);
    // getting day + 60
    expirationDate.setDate(today.getDate()+60);
    //exp, iat, builtin: https://www.npmjs.com/package/jsonwebtoken
    //secret: see https://jwt.io/
    return jwt.sign({
        email: this.email,
        userId: this.userId,
        exp: parseInt(expirationDate.getTime()/1000, 10)
    }, 'secret');
}


//configure autoincrement
User.plugin(autoIncrement.plugin, {
    model: 'User', 
    field: 'userId',
    startAt: 100
});




module.exports = mongoose.model('User', User);