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
        required: false
    },
    senderdispname:{
        type: String,
        required: false
    },
    receivername:{
        type: String,
        required: false
    },
    receiverdispname:{
        type: String,
        required: false
    },
    timestamp:{
        type: Date,
        default: Date.now
    }

});

//declare module exports and create collection
module.exports = UserMessage = Mongoose.model('usermessage', UserMessageSchema);