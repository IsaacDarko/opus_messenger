//require all needed external resources
const Express = require('express');
const router = Express.Router();

//retrieving model
const Users = require('../../models/Users.js');

//@route  GET api/users/sync
//@descr  Gets all users
//@access Private
router.get('/sync', (req, res)=>{
    Users.find()
    .sort({date: 1})
    .then(users => res.json(users))
    .catch(err => res.status(404).json({success: false}));
});

//@route  POST api/user
//@descr  Creates a user
//@access Private
router.post('/', (req, res)=>{
    const newUsers = new Users({
        userdeets: req.body.userdeets
    });
    newUsers.save()
    .then(users => {res.status(201).json(users)
    console.log("data inserted successfully");
    })
    .catch(err => res.status(404).json({success: false}));
});

//@route  DELETE api/users/:id
//@descr  Deletes a user
//@access Private
router.delete('/:id', (req, res)=>{
    Users.findById(req.params.id)
    .then(users => users.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//declare module exports
module.exports = router;