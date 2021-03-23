const mongoose = require('mongoose'); 
const autoIncrement = require('mongoose-auto-increment');
const mongoConfig = require('../config/mongoConfig.json');

mongoose.connect(mongoConfig.url, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', (err)=>{
    console.log("no error")
})

mongoose.connection.on('error', (err)=>{
    console.log('Mongoose default connnection error ' + err);
})
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose;