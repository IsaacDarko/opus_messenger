//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//set up schema using mongoose schema method
const UsersSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    lastseen: {
        type: Date,
        required: false
    },
    loggedin: {
        type: Boolean,
        required: false
    }
});

//declare module exports and create collection
module.exports = Users = Mongoose.model('users', UsersSchema);