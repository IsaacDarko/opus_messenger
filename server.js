//Including all required files
const Express = require('express');
const Mongoose = require('mongoose');
const Pusher = require('pusher');
const { jwtCheck } = require('./check-jwt')
const cors = require('cors');
const dotenv = require('dotenv').config();

//initialising express
const app = Express();

//middleware
//setting up the express in-built json parser
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
//setting up headers using cors package
app.use(cors());

//api health test for debugging during deployment
app.get("/", (req, res)=> res.status(200).send("Hello there"));

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


//setting up change stream to activate Mongo-live-database
const dbStream = Mongoose.connection
dbStream.once("open", ()=>{
    const msgCollection = dbStream.collection("usermessages");
    const changeStream = msgCollection.watch();
    console.log("MongoDB data stream open");

    
    changeStream.on("change", (change) => {
        console.log(change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            const chatDetails = change.fullDocument;
            pusher.trigger(['messages'], 'inserted', {
                id: messageDetails._id,
                name: messageDetails.name,
                message: messageDetails.message,
                sub: messageDetails.id,
                chatid: messageDetails.chatid,
                timestamp: messageDetails.timestamp
            })
        }else{
            console.log("Pusher was not triggered")
        }
    
    })
})



//assign listening port
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server listening on port ${port}`));