//require all needed external resources
const Express = require('express');
const router = Express.Router();
const axios = require("axios").default;
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving model
const Users = require('../../models/Users.js');
const Block = require('../../models/Blocklist');

const options = {
    method: 'GET',
    url: 'https://dev--fe2sg9v.us.auth0.com/api/v2/users',
    headers: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InkzR3RhdGJTQWtxV2VwQkQ5Z19rViJ9.eyJpc3MiOiJodHRwczovL2Rldi0tZmUyc2c5di51cy5hdXRoMC5jb20vIiwic3ViIjoiU0c5b05RS0JBOTJmTXd2czF3dGtvSEs1anJRTFFRNG5AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LS1mZTJzZzl2LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjIxOTQ2MTQ3LCJleHAiOjE2MjQ1MzgxNDcsImF6cCI6IlNHOW9OUUtCQTkyZk13dnMxd3Rrb0hLNWpyUUxRUTRuIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.e3_qcoD_wwR4SGuInjb4zjiK61K3664Gss-bAlMMav7oHyk-lSuFSlO4RdcnKEdr0-DXt155KFBfb3LX4eTU_htnTkx9O5d046qIXgoegw1EUG23FlZcsYBD9iBIA4NSFK7M2rYDL0lTJtMfj6ZQ7Y6hfLMj6nJkAc-fbkNEjW9csCZepCmRRX-xzMMAuJGuAw3EKnHtRDZYDY_Yv_nvqX18MR45nMW4i1icclrJYPk3NrsFKoklYTwnmMcPiIO43kYArkh974XaibmhfVqlHLuhl2pa7feYDCKU-WdicBZqVIJZ60yRVBYoAaZ0SOZUqXsJKX51Pc0dqxmLQfP-VQ'}
};
axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});


//@route  GET api/users/set/
//@descr  Checks if anyone has blocked user
//@access Private
router.get('/set/:id', (req, res)=>{
    const id = req.params.id
    console.log(id);
    Block.find({
        blockee_id:id
    })
    .sort({date: 1})
    .then(response => {
        console.log(response.data)
        res.status(200).json(response);
    })
    .catch(err => res.json({success: false}));
});



//@route  GET api/users/sync
//@descr  Gets all users
//@access Private
router.get('/sync', (req, res)=>{    
    const userid = req.params.id
    axios.request(options).then(function (response) {
        console.log(response.data);
        const stuffs = response.data
        const contactlist = stuffs.filter(function( contact ) {
            return contact.name !== userid;
        });
        contactlist.forEach(contact => {
            delete contact.identities;
        });

        console.log(contactlist)
        
        res.status(200).json(contactlist);
    })
    .catch(function (error) {
    console.error(error);
    });
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


//@route  POST api/users/block
//@descr  Allows for blocking a user using their id
//@access Private
router.post('/block',(req,res)=>{
    const deets = req.body.options;
    console.log(deets)
    const newBlock = new Block({

        blocker_id :deets.blocker_id,
        blocker_name :deets.blocker_name,
        blockee_id :deets.blockee_id,
        blockee_name :deets.blockee_name,
        blocker_mail :deets.blocker_mail,
        blockee_mail :deets.blockee_mail,
        blocker_dispName :deets.blocker_dispName,
        blockee_dispName :deets.blockee_dispName

    })
    newBlock.save()
    .then(blockdetails => {
    console.log(blockdetails)
    console.log(`data was inserted successfully: ${blockdetails}`);
    res.status(201).json(chatdeets);
    }) 
    .catch(err => console.log(err));
})


//@route  DELETE api/users/unblock
//@descr  Allows for unblocking a user using their id
//@access Private
router.delete('apis/users/unblock',(req,res)=>{
    Block.findById(req.params.id)
    .then(entry => 
        entry.remove()
        .then(() => res.status(200).json({success:true}))
        .catch(err => console.log(err))
        )
    .catch(err => console.log(err));
})



//declare module exports
module.exports = router;