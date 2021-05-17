import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { Switch } from 'react-router-dom';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import StartChatModal from './Components/StartChatModal';
import Pusher from "pusher-js";
import axios from './axios';

import { useAuth0 } from '@auth0/auth0-react'
import ProtectedRoute from './auth/protected-route';

function App() {
  const { getAccessTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const [ show, setShow ] = useState();
  const [contactlist, setContactlist] = useState([]);
  const [ gotId, setGotId ] = useState(false);
  const [chatId, setChatId] = useState();
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);



  const retrieveMessages = () =>{
    axios.get('api/messages/sync')
    .then(res =>{
      console.log(res.data);
      setMessages(res.data)
    }).catch(err => console.log(`there was an API Error ${err}`));
  }

  const retrieveChats = () =>{
    axios.get('api/chats/sync')
    .then(res =>{
      console.log(res.data);
      setChats(res.data)
    }).catch(err => console.log(`there was an API Error : ${err}`));
  }



  const switchOff = () => {
    setShow(null);
  }

/*
  const syncMessagesSecurely = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);
      const response = await fetch(
        `/api/messages/sync`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      setMessages(responseData.message);
    } catch (error) {
      console.log(error.message);
    }
  };


  const syncChatsSecurely = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `/api/chats/sync`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      setChats(responseData.message);
    } catch (error) {
      console.log(error.message);
    }
  };
  */

  
  const fetchChat = () => {
    const id = localStorage.getItem('chatid')
    console.log(id); 
    if( id !== null || id !== [] || id !== ''){
      axios.get(`/api/messages/chat/${id}`)
      .then(response => {
        if(response !== null || response !== []){
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
    const chatid = localStorage.getItem('chatId');
    console.log(chatid);
    axios.delete(`api/chats/${chatid}`)
    .then(res => {
      console.log(res)
    })
  }



  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);      
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  },[messages]);



  useEffect(()=>{
    retrieveChats()
    retrieveMessages()
  }, [])


  console.log(messages);
  



  return (
    //using the BEM naming convention
    <div className="app">

      <div className="app__body"> 

            <Switch>

              <ProtectedRoute exact path="/" component={Chat}>

                <StartChatModal contactlist={contactlist} show={show} setShow={setShow} switchOff={switchOff} selectUser={selectUser} />
                <Sidebar chats={chats} user={user} show={show} setShow={setShow} addNewChat={addNewChat} fetchChat={fetchChat} contactlist={contactlist} deleteNow={deleteNow} gotId={gotId} setGotId={setGotId} />
                <Chat messages={messages} user={user} chats={chats} chatId={chatId} setMessages={setMessages} />
                
              </ProtectedRoute>
              
            </Switch>
        
      </div>

    </div>  
  )}

export default App;
