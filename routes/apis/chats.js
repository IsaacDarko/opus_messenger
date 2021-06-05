//require all needed external resources
const Express = require('express');
const router = Express.Router();
const Mongoose = require('mongoose');
const Pusher = require('pusher');
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving model
const Chats = require('../../models/Chats');
const UserMessage = require('../../models/UserMessage');
const Users = require('../../models/Users.js');
const Block = require('../../models/Blocklist');

//initialising express
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
//setting up headers using cors package
app.use(cors());
app.use(jwtCheck);

const pusher = new Pusher({
    appId: "1201019",
    key: "0d81b56dcdff3b8a813c",
    secret: "c89923ca5686debc49ba",
    cluster: "mt1",
    useTLS: true
});




//@route  GET api/chats/sync
//@descr  Gets all user chats
//@access Private
router.get('/sync', (req, res)=>{
    Chats.find()
    .sort({date: -1})
    .then(response => {
        //console.log(response.data)
        res.status(200).json(response);
    })
    .catch(err => res.json({success: false}));
});



//@route  POST api/chats
//@descr  Post a newly started chat
//@access Private 
router.post('/',  (req, res)=>{
    //console.log(req.body);
    const freshChat = req.body.options;
    const rawKeyFrag1 = freshChat.recpt_id;
    const rawKeyFrag2 = freshChat.sndrs_id;
    const keyfrag1String = rawKeyFrag1.split("|").pop();
    const keyfrag2String = rawKeyFrag2.split("|").pop();
    //console.log(`so we popped both ids to get key fragments and here they are: ${keyfrag1String} and ${keyfrag2String}`);
    const keyfrag1 = keyfrag1String;
    const keyfrag2 = keyfrag2String;    
    const chatKey = keyfrag1+keyfrag2;
    //console.log(chatKey);
    const convo = [{
        recpt_id: freshChat.sndrs_id,
        recpt_name: freshChat.sndrs_name,
        sndrs_id: freshChat.recpt_id,
        sndrs_name: freshChat.recpt_name,
        recpt_mail: freshChat.sndrs_mail,
        sndrs_mail: freshChat.recpt_mail,
        recptdispName: freshChat.sndrsdispName,
        sndrsdispName: freshChat.recptdispName,
        recptdispPic: freshChat.sndrsPicture,
        sndrsdispPic: freshChat.recptPicture,
        specialkey: chatKey,
        blocked: false,
        last_msge: freshChat.last_mesge,
        msges_num: freshChat.numofmsges
    },
    {
        recpt_id: freshChat.recpt_id,
        recpt_name: freshChat.recpt_name,
        sndrs_id: freshChat.sndrs_id,
        sndrs_name: freshChat.sndrs_name,
        recpt_mail: freshChat.recpt_mail,
        sndrs_mail: freshChat.sndrs_mail,
        recptdispName: freshChat.recptdispName,
        recptdispPic: freshChat.recptPicture,
        sndrsdispName: freshChat.sndrsdispName,
        specialkey: chatKey,
        blocked: false,
        last_msge: freshChat.last_mesge,
        msges_num: freshChat.numofmsges
    }

]   
    Chats.collection.insertMany(convo, function (err, docs) {
    if (err){ 
        return console.error(err);
    } else {
        //console.log(docs);
        res.status(200).json("chat created")
    }
    });

    })




//@route  GET api/chats/chat/:id
//@descr  Gets all of a particular user's chats using their id
//@access Private
router.get('/chat/:id', (req, res) =>{
    //console.log(req.params.keys);
    const id = req.params.id;
    //console.log(id);
    Chats.find({  
            sndrs_id: id     
        })
    .sort({date: 1})
    .then( chats => { 
        res.status(200).json(chats)     
    }).catch(err => console.log(err))
})



//@route  DELETE api/chats/:id
//@descr  Deletes a chat
//@access Private
router.delete('/:id', (req, res)=>{
    //console.log(req.params)
    const csk = req.params.id
    //console.log(csk);
    Chats.deleteMany({
        specialkey:csk
    })
    .then(chat =>{
        //console.log(chat)
        res.status(200).json("Deleted")
    })
    .catch((err) => {
        res.json({success:false})
    })
});


//declare module exports
module.exports = router;