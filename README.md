# opus_messenger
A live chat messenger system built on the MERN stack, with partial devops functionality

Setup Scripts<br/>
 npm run client ---- Starts the client server on port 3000<br/>
 npm run server ---- Starts the server with change monitoring<br/>
 npm install ------- Install all the dependencies needed for the app to run<br/>
 npm run dev ------- set a concurrent console which runs both front end and back end simultaneously (Useful for dev purposes on a local machine)<br/>
 npm run heroku-postbuild ---- initiates the production build, ie. it compiles the the react front-end automatically and pushes both front and backend to heroku<br/><br/>
 
 
The application is a single page app, but all modern react methods and practices are implemented to ensure that it run perfectly. It uses both react functional and arrow functions to optimize performance. Auth0 for react is used to provide an authentication layer and is also used to handle all end user functionality.<br/><br/>


Features<br/><br/>
User Registration<br/>
User Login/Logout<br/>
User Validation for secured api endpoints<br/>
Message Sending Between Registered User<br/>
Shows all user messages with a selected contact in the main pane on the right<br/>
Shows a list of all the users you are currently chatting with in the left panel<br/>
Message box in the bottom pane, where you type in messages to be sent<br/>
