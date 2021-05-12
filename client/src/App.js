import React, { useEffect, useState } from 'react';
import './App.css';
import { Switch } from 'react-router-dom';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import Pusher from "pusher-js";
import axios from './axios';

import { useAuth0 } from '@auth0/auth0-react'
import ProtectedRoute from './auth/protected-route';

function App() {
  const { user } = useAuth0();
  const [chatId, setChatId] = useState();
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);

  
  const fetchChat = () => {
    setMessages([]);
    const chatid = JSON.stringify(localStorage.getItem('chatid'));
    const id = JSON.parse(chatid) 
    console.log(chatid);
    axios.get(`/api/messages/chat/${id}`)
    .then(response => {
      console.log(response);
      const data = response.data
      console.log(data);
      setMessages(data);
      setChatId(id);
      console.log(messages);
    })
  }

  const addNewChat = () => {

  }


{/*}
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
*/}

  useEffect(() =>{
    axios.get('/api/chats/sync')
    .then( response => {
      setChats(response.data);
    })
  }, []);
  

  return (
    //using the BEM naming convention
    <div className="app">

      <div className="app__body"> 
             
            <Switch>

              <ProtectedRoute exact path="/" component={Chat}>
                <Sidebar chats={chats} user={user} addNewChat={addNewChat} fetchChat={fetchChat} />
                <Chat messages={messages} user={user} chats={chats} chatId={chatId} />
              </ProtectedRoute>
              
            </Switch>
        
      </div>

    </div>  
  )}

export default App;
