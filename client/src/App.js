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
  const [chatId, setChatId] = useState('');
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [ loggedInUser, setLoggedInUser ] = useState({});
  const [ myBlockees, setMyBlockees ] = useState([]);
  const [ currentChat, setCurrentChat ] = useState({
    name:'Name', picutue:'', last_login:'today'
  });

  useEffect(()=>{
    console.log(user)
    setCurrentChat([{picture:'', name:'', last_login:''}]);
    if(user === undefined || user === []){  
      setLoggedInUser(user);
    }else{
      
    setCurrentChat([{picture:'', name:'', last_login:''}]);
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





  const chatRejuvinate = () => {
    const recpt = JSON.parse(localStorage.getItem('currentUser'));
    const chatid = localStorage.getItem('chatid');
    console.log(chatid)
    setChatId(chatid)
    console.log(recpt)
    const recptid = recpt.userid;
    console.log(recptid)
    axios.get('api/users/sync')
    .then(res =>{
      console.log(res)
      const users = res.data;
      console.log(users);
      let currUser = {};
      currUser = users.find(user => {
        return user.user_id === recptid
      })
      console.log(currUser);
      setCurrentChat(currUser);
      console.log(currentChat)
      localStorage.setItem('currentChat', JSON.stringify(currUser))
    }).catch(err => console.log(err))
  }





  useEffect(()=>{
    console.log(currentChat)
  }, [currentChat])



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
      const currChat = res.data[0];
      console.log(currChat);
      localStorage.setItem('currentChat', JSON.stringify(currChat))
    }).catch(err => console.log(`there was an API Error : ${err}`));
  }



  const switchOff = () => {
    setShow(null);
  }


  const blockUser = () => {
    const options = JSON.parse(localStorage.getItem('selectedBlock'));
    console.log(options)
    axios.post('api/users/block/', {
      options
    }).then((res)=>{
      console.log(res)
      const blockee = res.data
      const blockeeid = blockee.id;
      const blockeename = blockee.name;
      console.log(`alright so these are new blockeeid: ${blockeeid} and their name is ${blockeename}`);
      alert(`You have just blocked ${blockeename}`)
    })
    .catch(err => console.log('Block Attempt Failed'))
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
    const id = sub
    axios.get(`api/users/set/${id}`)
    .then(response=>{
      const enemy = response.data;
      console.log(enemy);
      const enemy_ids = enemy.reduce(
        (arr, elem)=> arr.concat(elem.blocker_id),[]
        );
      console.log(enemy_ids)
      axios.get('api/users/sync')
      .then(res => {
        console.log(enemy_ids);
        const contacts = res.data;
        console.log(contacts)
        for(let i = 0; i < enemy_ids.length; i++){
            const enemy_id = enemy_ids[i];
            const friends = contacts.filter(contact => 
              contact.user_id !== enemy_id && contact.user_id !== sub
            ) 
            console.log(friends);
            setContactlist(friends);
        } 
      })     
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
    const rawId = localStorage.getItem('selectedDel');
    console.log(rawId);
    const id = rawId.replace(/^"(.*)"$/, '$1');
    axios.delete(`api/chats/${id}`)
    .then(res => {
      console.log(res)
      alert(res.data)
      retrieveUsersChats()
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
      console.log(newMessage)      
    });
    chatChannel.bind('inserted', function(newChat) {
      setChats([...chats, newChat]);
      console.log(newChat)
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
                <Sidebar chatid={chatId} setChatId={setChatId} chatRejuvinate={chatRejuvinate}  retrieveUsersChats={retrieveUsersChats}  blockUser={blockUser} chats={chats} user={user} show={show} setShow={setShow} addNewChat={addNewChat} fetchChat={fetchChat} contactlist={contactlist} deleteNow={deleteNow} gotId={gotId} setGotId={setGotId} />
                <Chat chatId={chatId} setChatId={setChatId} chatRejuvinate={chatRejuvinate} currentChat={currentChat} messages={messages} user={user} chats={chats} chatId={chatId} setMessages={setMessages} />
                
              </ProtectedRoute>
              
            </Switch>
        
      </div>

    </div>  
    
  ):(
      <Login />
  )}

export default App;
