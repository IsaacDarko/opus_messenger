//require all needed external resources
const Express = require('express');
const router = Express.Router();

//retrieving model
const Chats = require('../../models/Chats');

//@route  GET api/chats/sync
//@descr  Gets all user chats
//@access Private
router.get('/sync', (req, res)=>{
    Chats.find()
    .sort({date: -1})
    .then(chats => res.json(chats))
    .catch(err => res.status(404).json({success: false}));
});

//@route  POST api/chats
//@descr  Post a newly started chat
//@access Private
router.post('/', (req, res)=>{
    const newChat = new Chats({
        recpt_id: req.body.recpt_id,
        recpt_name: req.body.recpt_name,
        recpt_mail: req.body.recpt_mail,
        recpt_num: req.body.recpt_num,
        disp_name: req.body.disp_name,
        last_msge: req.body.last_mesge,
        msges_num: req.body.numofmsges
    });
    newChat.save()
    .then(chatdeets => {res.status(201).json(chatdeets)
    console.log("data inserted");
    })
    .catch(err => res.status(404).json({success:false}))    
});

//@route  DELETE api/chat/:id
//@descr  Deletes a chat
//@access Private
router.delete('/:id', (req, res)=>{
    Chats.findById(req.params.id)
    .then(chat => chat.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//declare module exports
module.exports = router;