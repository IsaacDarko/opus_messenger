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
    const iscurrent = localStorage.getItem('current');
    console.log(iscurrent);
    if(user){
      setCurrent(user)
      localStorage.setItem('user', JSON.stringify(user))
    }else{
      setCurrent();

    }
  },[user, current])

  useEffect(() => {
    axios.get('/api/messages/sync')
    .then( response => {
      setMessages(response.data);
      console.log(messages);
    })
  }, [messages]);

  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
      alert(JSON.stringify(newMessage));
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


console.log(messages);
console.log(chats);


  return current ? (
    //using the BEM naming convention
    <div className="app">
      <div className="app__body"> 
          <Sidebar chats={chats} user={user} addNewChat/>

          <Chat messages={messages} user={user} />

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
