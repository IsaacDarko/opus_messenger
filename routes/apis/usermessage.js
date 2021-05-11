//require all needed external resources
const Express = require('express');
const router = Express.Router();

//retrieving model
const UserMessage = require('../../models/UserMessage');

//@route  GET api/usermessage/sync
//@descr  Gets all user messages
//@access Private
router.get('/sync', (req, res)=>{
    UserMessage.find()
    .sort({date: 1})
    .then(usermessages => res.json(usermessages))
    .catch(err => res.status(404).json({success: false}));
});

//@route  POST api/usermessage
//@descr  Post a user message
//@access Private
router.post('/', (req, res)=>{
    const newUserMessage = new UserMessage({
        usermessage: req.body.usermessage,
        username: req.body.username,
        received: req.body.received
    });
    newUserMessage.save()
    .then(usermessage => {res.status(201).json(usermessage)
    console.log("data inserted successfully");
    })
    .catch(err => res.status(404).json({success: false}));
});

//@route  DELETE api/usermessage/:id
//@descr  Deletes a user message
//@access Private
router.delete('/:id', (req, res)=>{
    UserMessage.findById(req.params.id)
    .then(message => message.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//declare module exports
module.exports = router;