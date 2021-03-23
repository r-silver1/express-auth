var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var localStorage = require('node-localstorage')

router.get('/', function(req, res){
    // ..skude 52
    var token = localStorage.getItem('authtoken');
    console.log("token>", token)
    if(!token){
        res.redirect('/')
    }
    jwt.verify(token, config.secret, function(err, decoded){
        
    })
})