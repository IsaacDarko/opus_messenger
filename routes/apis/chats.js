//require all needed external resources
const Express = require('express');
const router = Express.Router();
const Mongoose = require('mongoose');
const Pusher = require('pusher');
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving model
const Chats = require('../../models/Chats');

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
        console.log(response.data)
        res.status(200).json(response);
    })
    .catch(err => res.json({success: false}));
});



//@route  POST api/chats
//@descr  Post a newly started chat
//@access Private 
router.post('/',  (req, res)=>{
    console.log(req.body);
    const freshChat = req.body.options;
    const newChat = new Chats({
        recpt_id: freshChat.recpt_id,
        recpt_name: freshChat.recpt_name,
        sndrs_id: freshChat.sndrs_id,
        sndrs_name: freshChat.sndrs_name,
        recpt_mail: freshChat.recpt_mail,
        sndrs_mail: freshChat.sndrs_mail,
        recptdispName: freshChat.recptdispName,
        recptdispPic: freshChat.recptPicture,
        sndrsdispName: freshChat.sndrsdispName,
        last_msge: freshChat.last_mesge,
        msges_num: freshChat.numofmsges
    })
    newChat.save()
    .then(chatdeets => {
    console.log('data was inserted successfully');
    res.status(201).json(chatdeets);
    console.log("data inserted");
    }) 
    .catch(err => console.log(err));

    })




//@route  GET api/chats/chat/:id
//@descr  Gets all of a particular user's chats using their id
//@access Private
router.get('/chat/:id', (req, res) =>{
    console.log(req.params);
    const id = req.params.id;
    console.log(id);
    Chats.find({ 
        sndrs_name: id
    }).sort({date: -1})
        .then(chats => res.status(200).json(chats))
        .catch(err => res.status(404).json({success: false}));
    
});



//@route  DELETE api/chat/:id
//@descr  Deletes a chat
//@access Private
router.delete('/:id', jwtCheck, (req, res)=>{
    Chats.findById(req.params.id)
    .then(chat => chat.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//declare module exports
module.exports = router;