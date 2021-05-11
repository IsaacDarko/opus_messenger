import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import Pusher from "pusher-js";
import axios from './axios';

function App() {
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);

  useEffect(() => {
    axios.get('/api/chats/sync')
    .then( response => {
      setChats(response.data);
    })
  }, [])

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

console.log(chats);


  return (
    //using the BEM naming convention
    <div className="app">
      <div className="app__body"> 
          <Sidebar chats={chats} addNewChat/>

          <Chat />

      </div>


    </div>  
  );
}

export default App;
