//require all needed external resources
const Express = require('express');
const router = Express.Router();
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving model
const UserMessage = require('../../models/UserMessage');

//initialising express
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
//setting up headers using cors package
app.use(cors());
app.use(jwtCheck);

//@route  GET api/messages/sync
//@descr  Gets all user messages
//@access Private
router.get('/sync', (req, res)=>{ 
    UserMessage.find()
    .sort({date: 1})
    .then(usermessages => res.json(usermessages))
    .catch(err => res.status(404).json({success: false}));
});


//@route  GET api/messages/chats/:id
//@descr  Gets all messages in a particular chat
//@access Private
router.get('/chat/:id', (req, res)=>{
    console.log(req.params);
    const id =  req.params.id;
    console.log(id);
    UserMessage.find({
        chatid:id
    })
    .then(chatmessages => {
        console.log(chatmessages);
        res.status(200).json(chatmessages);
    })
    .catch(err=> {
        console.log(err);
        res.status(400).json("Sorry that was bad request")
    })
})


//@route  POST api/messages/
//@descr  Post a user message
//@access Private
router.post('/', (req, res)=>{
    console.log(req.body)
    const newUserMessage = new UserMessage({
        chatid: req.body.chatid,
        message: req.body.message,
        sendername: req.body.name,        
        senderid: req.senderid,
        senderdispname: req.senderdispname,
        receivername: req.receivername,
        receiverdispname: req.receiverdispname

    });
    newUserMessage.save()
    .then(usermessage => {res.status(201).json(usermessage)
    console.log("data inserted successfully");
    })
    //.catch(err => res.status(404).json({success: false}));
});

//@route  DELETE api/messages/:id
//@descr  Deletes a user message
//@access Private
router.delete('/:id', (req, res)=>{
    UserMessage.findById(req.params.id)
    .then(message => message.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//declare module exports
module.exports = router;