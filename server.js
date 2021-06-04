//Including all required files
const Express = require('express');
const Mongoose = require('mongoose');
const Pusher = require('pusher');
const { jwtCheck } = require('./check-jwt')
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');

//initialising express
const app = Express();

//middleware
//setting up the express in-built json parser
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
//setting up headers using cors package
app.use(cors());

//api health test for debugging during development
//app.get("/", (req, res)=> res.status(200).send("Hello there"));

//Serve static assets if in production (to be removed later for dockerisation)
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(Express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}



//setting up routes
const userMessages = require('./routes/apis/usermessage');
const userChats = require('./routes/apis/chats.js');
const users = require('./routes/apis/users');


//use routes
app.use('/api/messages', userMessages);
app.use('/api/chats', userChats);
app.use('/api/users', users);





//retrieving database keys and configs
const db = require('./config/keys').mongoURI;
const { expressJwtSecret } = require('jwks-rsa');
const pusher = new Pusher({
    appId: "1201019",
    key: "0d81b56dcdff3b8a813c",
    secret: "c89923ca5686debc49ba",
    cluster: "mt1",
    useTLS: true
});


//connecting to the MongoDB atlas cloud
Mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('MongoDB connected...'))
    .catch(err => console.log(err));


//setting up change stream to activate Mongo-live-database(CRUD first then trigger render)
const dbStream = Mongoose.connection
dbStream.once("open", ()=>{
    const msgCollection = dbStream.collection("usermessages");
    const chatsCollection = dbStream.collection("chats");
    const messageChangeStream = msgCollection.watch();
    const chatsChangeStream = chatsCollection.watch();
    console.log("MongoDB data streams open");

    
    messageChangeStream.on("change", (change) => {
        console.log(change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger(['messages'], 'inserted', {
                id: messageDetails._id,             //this is what pusher sends from the changeDocument to frontend
                name: messageDetails.sendername,    //this is what pusher sends from the changeDocument to frontend
                message: messageDetails.message,    //this is what pusher sends from the changeDocument to frontend
                chatid: messageDetails.chatid,      //this is what pusher sends from the changeDocument to frontend
                timestamp: messageDetails.timestamp //this is what pusher sends from the changeDocument to frontend
            })
        }else if(change.operationType === 'deleted'){
            pusher.trigger(
                ['messages'], 'deleted', 
                change.documentKey._id
            )}else{
            console.log("Pusher was not triggered")
        }
    
    })

    chatsChangeStream.on("change", (change) => {
        console.log(change);

        if(change.operationType === 'insert'){
            const chatDetails = change.fullDocument;
            pusher.trigger(['chats'], 'inserted', {
                recpt_id: chatDetails.recpt_id,     //this is what pusher sends from the changeDocument to frontend
                recpt_name: chatDetails.recpt_name, //this is what pusher sends from the changeDocument to frontend
                sndrs_id : chatDetails.sndrs_id,    //this is what pusher sends from the changeDocument to frontend
                sndrs_name : chatDetails.sndrs_name,//this is what pusher sends from the changeDocument to frontend
                recpt_mail: chatDetails.recpt_mail, //this is what pusher sends from the changeDocument to frontend
                sndrs_mail : chatDetails.sndrs_mail,//this is what pusher sends from the changeDocument to frontend
                recptdispName: chatDetails.recptdispName,//this is what pusher sends from the changeDocument to frontend
                recptdispPic: chatDetails.recptdispPic,//this is what pusher sends from the changeDocument to frontend
                last_msge : chatDetails.last_msge,  //this is what pusher sends from the changeDocument to frontend
                chatid: chatDetails.chatid,         //this is what pusher sends from the changeDocument to frontend
                msges_num : chatDetails.msges_num,  //this is what pusher sends from the changeDocument to frontend
                timestamp: chatDetails.timestamp    //this is what pusher sends from the changeDocument to frontend
            })
        }else if(change.operationType === 'deleted'){
            pusher.trigger(
                ['chats'], 'deleted', 
                change.documentKey._id
            )
        }else{
            console.log("Pusher was not triggered")
        }
        
    })


})



//assign listening port
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server listening on port ${port}`));