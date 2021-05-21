//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//set up schema using mongoose schema method 
const UserMessageSchema = new Schema({
    chatid:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    sendername:{
        type: String,
        required: true
    },
    senderid:{
        type: String,
        required: true
    },
    senderdispname:{
        type: String,
        required: true
    },
    receivername:{
        type: String,
        required: true
    },
    receiverdispname:{
        type: String,
        required: true
    },
    chatspecialkey:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }

});

//declare module exports and create collection
module.exports = UserMessage = Mongoose.model('usermessage', UserMessageSchema);