import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import LoginButton from './Components/LoginButton';
import Pusher from "pusher-js";
import axios from './axios';

import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { user } = useAuth0();
  const [ current, setCurrent ] = useState();
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);

  useEffect( () => {
    console.log(user);
    if(user){
      setCurrent(user)
    }else{
      setCurrent()
    }
  },[user, current])

  useEffect(() => {
    axios.get('/api/messages/sync')
    .then( response => {
      setMessages(response.data);
    })
  }, []);

  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  }

},[messages]);


  useEffect(() =>{
    axios.get('/api/chats/sync')
    .then( response => {
      setChats(response.data);
    })
  }, []);

  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('chats');
    channel.bind('inserted', function(newChat) {
      alert(JSON.stringify(newChat));
      setChats([...chats, newChat])
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  }

},[chats]);

console.log(messages);
console.log(chats);


  return current ? (
    //using the BEM naming convention
    <div className="app">
      <div className="app__body"> 
          <Sidebar chats={chats} addNewChat/>

          <Chat messages={messages} />

      </div>


    </div>  
  ):(
    <div className="app">
      <div className="app__body"> 
          <LoginButton />
      </div>
    </div> 
  )
}

export default App;
