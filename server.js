//Including all required files
const Express = require('express');
const Mongoose = require('mongoose');
const Pusher = require('pusher');

//initialising express
const app = Express();

//api health test for debugging during depoloyment
app.get("/", (req, res)=> res.status(200).send("Hello there"));
//setting up routes
const userMessage = require('./routes/apis/usermessage');


//middleware
//setting up the express in-built json parser
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));


//retrieving database keys and configs
const db = require('./config/keys').mongoURI;
const pusher = new Pusher({
    appId: "1201019",
    key: "0d81b56dcdff3b8a813c",
    secret: "c89923ca5686debc49ba",
    cluster: "mt1",
    useTLS: true
  });
//setting up change stream to activate live database
const dbStream = Mongoose.connection
dbStream.once("open", ()=>{
    const msgCollection = dbStream.collection("usermessages");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);
    })

    console.log("MongoDB data stream open");
})


//connecting to the MongoDB atlas cloud
Mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('MongoDB connected...'))
    .catch(err => console.log(err));


//Use routes
app.use('/api/usermessage', userMessage);

//assign listening port
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server listening on port ${port}`));