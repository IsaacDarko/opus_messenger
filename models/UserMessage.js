//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//set up schema using mongoose schema method
const UserMessageSchema = new Schema({
    usermessage:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: false
    },
    received:{
        type: Boolean,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }

});

//declare module exports and create collection
module.exports = UserMessage = Mongoose.model('usermessage', UserMessageSchema);