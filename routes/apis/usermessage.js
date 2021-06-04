//require all needed external resources
const Express = require('express');
const router = Express.Router();
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving model
const UserMessage = require('../../models/UserMessage');
const Users = require('../../models/Users.js');
const Block = require('../../models/Blocklist');
const Chats = require('../../models/Chats');

//initialising express
const app = Express();

//helper function
const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
}


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


//@route  GET api/messages/:id
//@descr  Gets all messages for a particular user
//@access Private
router.get('/:id', (req, res)=>{ 
    const id = req.params.id
    //console.log(id);
    UserMessage.find({
        sendername: id

    })
    .sort({date: 1})
    .then(usermessages => res.json(usermessages))
    .catch(err => res.status(404).json({success: false}));
});




//@route  GET api/messages/chats/:id
//@descr  Gets all messages in a particular chat
//@access Private
router.get('/chat/:id', (req, res)=>{
    //console.log(req.params);
    const id =  req.params.id;
    //console.log(id);
    UserMessage.find({
        chatspecialkey:id
    }).sort({date: -1})
    .then(chatmessages => {
        //console.log(chatmessages);
        res.status(200).json(chatmessages);
    })
    .catch(err=> {
        //console.log(err);
        res.status(400).json("Sorry that was bad request")
    })
})






//@route  POST api/messages/
//@descr  Post a user message
//@access Private
router.post('/', (req, res)=>{
    //console.log(req.body)
    const newUserMessage = new UserMessage({
        chatid: req.body.chatid,
        message: req.body.message,
        sendername: req.body.name,        
        senderid: req.body.senderid,
        senderdispname: req.body.sndrsdispname,
        receivername: req.body.receivername,
        chatspecialkey: req.body.chatSpecialKey,
        receiverdispname: req.body.receiverdispname
    });
    Block.find({
        blocker_name: req.body.receivername 
    })
    .then(blockStats => {
        //console.log(blockStats)
        let speckey = ""
        let csks = [];
        let instances = 0;
        
        blockStats.forEach(blockStat =>{
            instances++;
            csks.push(blockStat.chatspecialkey)
        });
        const csk = findDuplicates(csks)
        //console.log(csk);
        //console.log(instances)
        const pairkey = csk.forEach(key => {
            speckey.concat(key)
        })
        if( pairkey !== req.body.chatSpecialKey && instances === 0 ){
            newUserMessage.save()
            .then(usermessage => {
                res.status(200).json(usermessage)
                //console.log("data inserted successfully");
            })
        }else if(instances > 0){
            console.log('blocked')
            res.status(208).json('This user has blocked you')
        }else{
            console.log('something went wrong')
        }
    })
    

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