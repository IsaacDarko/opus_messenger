//require all needed external resources
const Express = require('express');
const router = Express.Router();

//retrieving model
const UserMessage = require('../../models/UserMessage');

//@route  GET api/messages/sync
//@descr  Gets all user messages
//@access Private
router.get('/sync', (req, res)=>{
    UserMessage.find()
    .sort({date: 1})
    .then(usermessages => res.json(usermessages))
    .catch(err => res.status(404).json({success: false}));
});


//@route  GET api/messages/chat
//@descr  Gets all messages in a particular chat
//@access Private
router.get('/chat', (req, res)=>{
    
})


//@route  POST api/messages/
//@descr  Post a user message
//@access Private
router.post('/', (req, res)=>{
    const newUserMessage = new UserMessage({
        usermessage: req.body.usermessage,
        username: req.body.username,
        userid: req.body.userid,
        chatid: req.body.chatid,
        sent: req.body.sent
    });
    newUserMessage.save()
    .then(usermessage => {res.status(201).json(usermessage)
    console.log("data inserted successfully");
    })
    .catch(err => res.status(404).json({success: false}));
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