import React, { useEffect, useState } from 'react';
import './App.css';
import { Switch } from 'react-router-dom';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import StartChatModal from './Components/StartChatModal';
import Login from './Components/Login';
import Pusher from "pusher-js";
import axios from './axios';
import { useAuth0 } from '@auth0/auth0-react'
import ProtectedRoute from './auth/protected-route';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [ show, setShow ] = useState();
  const [contactlist, setContactlist] = useState([]);
  const [ gotId, setGotId ] = useState(false);
  const [chatId, setChatId] = useState();
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [ loggedInUser, setLoggedInUser ] = useState({});

  useEffect(()=>{
    storageChecker()
  })

  useEffect(()=>{
    if(user === undefined || user === []){  
      setLoggedInUser(user);    
    }else{
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user);
      retrieveUsersChats();
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useAuth0, user]);


  const storageChecker = () => {
    const chatidChecker =  localStorage.getItem('chatid');
    const userChecker = localStorage.getItem('user');
    const messagesChecker = localStorage.getItem('messages');

    console.log(`Okay so these are your local storage variables-- chatid:${chatidChecker}, user details:${userChecker}, messages:${messagesChecker}`)
  }



  const retrieveUsersMessages = () =>{
    const myself = user
    console.log(myself)
    const id = myself.name;
    console.log(id);
    axios.get(`api/messages/${id}`)
    .then(responses =>{
      const responseData = responses.data
      console.log(responseData);
      const res = responseData.filter((response)=>{
          return { senderid:id }
      })
      console.log(res);
      setMessages(responses.data)
      console.log(messages);
    }).catch(err => console.log(`there was an API Error ${err}`));
  }




  const retrieveUsersChats = () =>{
    const myself = user
    console.log(myself)
    const id = myself.sub;
    console.log(id);
    axios.get(`api/chats/chat/${id}`)
    .then(res =>{
      console.log(res.data);
      setChats(res.data)
    }).catch(err => console.log(`there was an API Error : ${err}`));
  }



  const switchOff = () => {
    setShow(null);
  }


  const blockUser = () => {
    const userid = localStorage.getItem('selectedBlock');
    const blockersDeets = JSON.parse(localStorage.getItem('user'));
    const { blockersname, blockersmail, blockersdisplay } = blockersDeets
    const blockeesDeets = JSON.parse(localStorage.getItem('currentUser'));
    const { name, mail, displayname } = blockeesDeets


    const options = {
      blocker_id: userid,
      blocker_name: blockersname,
      blocker_mail: blockersmail,
      blocker_dispName: blockersdisplay,
      blockee_id: userid,
      blockee_name: name,
      blockee_mail: mail,
      blockee_dispName: displayname
      
    }
    axios.post('api/users/block/:id', {
      options
    }).then((res)=>{
      console.log(res)
      localStorage.removeItem('selectedBlock')
    })



  }


  
  const fetchChat = () => {
    const id = localStorage.getItem('chatid');
    const csk = localStorage.getItem('chatSpecialKey');
    console.log(id);
    console.log(csk);    
    if( csk !== null || csk !== [] || csk !== ''){
      axios.get(`/api/messages/chat/${csk}`)
      .then(response => {
        if(response.status === 200 ){
          console.log(response);
          const data = response.data
          console.log(data);
          setMessages(data);
          setChatId(id);
          console.log(messages);
        }else{
          console.log('there was a problem retrieving the messages for this chat, trying checking if the user is submitted')
        }
    }).catch()

    }else{
      console.log('No chat id was detected')
    }    
  }



  const addNewChat = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    const { sub } = user;
    console.log(sub);
      axios.get('api/users/sync')
      .then(res => {
        console.log(res.data);
        setContactlist(res.data); 
      })
  }



  const selectUser = () =>{
    const options = JSON.parse(localStorage.getItem('selectedUser'));
    if(options){
      console.log(options);
      axios.post(`api/chats/`, {
              options
          }
      ).then(response => {
        console.log(response.data)
        localStorage.removeItem('selectedUser');
        const newChatId = response.data._id;
        console.log(newChatId);

      })
      .catch(err => console.log(err))
      }else{
        alert('Please select a user');
      }
    
  }


  const deleteNow = () => {
    const csk = localStorage.getItem('selectedDel');
    console.log(csk);
    axios.delete(`api/chats/${csk}`)
    .then(res => {
      console.log(res)
      alert('Chat Deleted')
    })
  }





  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const messageChannel = pusher.subscribe('messages');
    const chatChannel = pusher.subscribe('chats');

    messageChannel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);      
    });
    chatChannel.bind('inserted', function(newMessage) {
      setChats([...chats, newMessage]);
      fetchChat();
    });

    return () => {
      messageChannel.unbind_all();
      messageChannel.unsubscribe();
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
    }

  },[messages, chats]);

  console.log(messages);
  console.log(chats);
  



  return isAuthenticated ? (

    //using the BEM naming convention
    <div className="app">

      <div className="app__body"> 

            <Switch>

              <ProtectedRoute exact path="/" component={Chat}>

                <StartChatModal contactlist={contactlist} show={show} setShow={setShow} switchOff={switchOff} selectUser={selectUser} />
                <Sidebar  retrieveUsersChats={retrieveUsersChats}  blockUser={blockUser} chats={chats} user={user} show={show} setShow={setShow} addNewChat={addNewChat} fetchChat={fetchChat} contactlist={contactlist} deleteNow={deleteNow} gotId={gotId} setGotId={setGotId} />
                <Chat messages={messages} user={user} chats={chats} chatId={chatId} setMessages={setMessages} />
                
              </ProtectedRoute>
              
            </Switch>
        
      </div>

    </div>  
    
  ):(
      <Login />
  )}

export default App;
