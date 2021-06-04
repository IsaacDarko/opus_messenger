//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//set up schema using mongoose schema method
const BlocklistSchema = new Schema({
    blocker_id:{
        type: String,
        required: true
    },
    blocker_name:{
        type: String,
        required: true
    },
    blockee_id:{
        type: String,
        required: true,
    },
    blockee_name:{
        type: String,
        required: true,
    },
    blocker_mail:{
        type: String,
        required: true
    },
    blockee_mail:{
        type: String,
        required: true
    },
    blocker_dispName:{
        type: String,
        required: true,
    },
    blockee_dispName:{
        type: String,
        required: false,
    },
    chatid:{
        type: String,
        required:false,
        unique: true
    },
    chatspecialkey:{
        type: String,
        required: true
    },
    reason:{
        type: String,
        required: false
    },
    strt_time: {
        type: Date,
        default: Date.now
    }
});

//declare module exports and create collection
module.exports = Block = Mongoose.model('blocklist', BlocklistSchema);