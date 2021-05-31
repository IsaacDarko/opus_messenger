//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

//set up schema using mongoose schema method
const ChatsSchema = new Schema({
    recpt_id:{
        type: String,
        required: true
    },
    recpt_name:{
        type: String,
        required: true
    },
    sndrs_id:{
        type: String,
        required: true
    },
    sndrs_name:{
        type: String,
        required: true,
    },
    recpt_mail:{
        type: String,
        required: true
    },
    sndrs_mail:{
        type: String,
        required: true
    },
    recptdispName:{
        type: String,
        required: true
    },
    recptdispPic:{
        type: String,
        required: false
    },
    snsndrsdispPic:{
        type:String,
        required: false
    },
    sndrsdispName:{
        type: String,
        required: true,
    },
    specialkey:{
        type: String,
        required: true
    },
    last_msge:{
        type: String,
        required: false
    },
    blocked:{
        type: Boolean,
        required: true,
        default: false
    },
    msges_num:{
        type: Number,
        required: false
    },
    strt_time: {
        type: Date,
        default: Date.now
    }
});

//declare module exports and create collection
module.exports = Chats = Mongoose.model('chats', ChatsSchema);