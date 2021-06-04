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
  const { user, isAuthenticated } = useAuth0();
  const [ show, setShow ] = useState();
  const [contactlist, setContactlist] = useState([]);
  const [ gotId, setGotId ] = useState(false);
  const [chatId, setChatId] = useState('');
  const [ chats, setChats ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  const [isChatId, setIsChatId] = useState(false);
  const [chatsExist, setChatsExist] = useState(false);
  const [messageMine,setMessageMine] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [ loggedInUser, setLoggedInUser ] = useState({});
  const [ currentChat, setCurrentChat ] = useState({});

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
      alert("Blocked")
    })
    .catch(() => console.log('Block Attempt Failed'))
  }


  const unblockUser = () =>{
    const userid = localStorage.getItem('unblockeeId');
    const id = userid.replace(/^"(.*)"$/, '$1');
    console.log(id);
    axios.delete(`api/users/unblock/${id}`)
    .then(res => {
      if (res.status === 200){
        axios.put(`api/users/unblock/chat/${id}`)
        .then(response =>{
          console.log(res)
          if(response.status === 200){
              alert('user unblocked')
          }else(
            console.log('There was a problem unblocking this user')
          )
        })
      }
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
    console.log(user)
    const { sub } = user;
    console.log(sub);
    const id = sub
    axios.get(`api/users/set/${id}`)
    .then(response=>{
      const enemy = response.data;
      console.log(enemy);
      let enemyCount = 0;

      enemy.forEach(idiot =>{
        enemyCount++
      })


      if( enemyCount > 0){
        let blockInstances = 0;
        enemy.forEach(() => {
          blockInstances ++
        })
        if( blockInstances === 0 ){
          console.log('adduser if condition fired')
          axios.get('api/users/sync')
          .then(res => {         
            const contacts = res.data
            const contactlist = contacts.filter(contact =>
              contact.user_id !== sub
            )
            console.log(contacts);
            setContactlist(contactlist);
            })
        }else if(blockInstances > 0){
          const enemy_ids = enemy.reduce(
            (arr, elem)=> arr.concat(elem.blocker_id),[]
            );
          console.log(enemy_ids)
          axios.get('api/users/sync')
          .then(res => {
            console.log('adduser elseif condition fired')
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
        }else{
          console.log('adduser else condition fired')
          axios.get('api/users/sync')
          .then(res => {         
            const contacts = res.data
            const contactlist = contacts.filter(contact =>
              contact.user_id !== sub
            )
            console.log(contacts);
            setContactlist(contactlist);
            })
        } 

      }else{
        console.log('chatCount is 0')
        axios.get('api/users/sync')
          .then(res => {         
            const contacts = res.data
            const contactlist = contacts.filter(contact =>
              contact.user_id !== sub
            )
            console.log(contacts);
            setContactlist(contactlist);
            })
      }
    
    
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
        // eslint-disable-next-line no-unused-vars
        console.log(newChatId);
        alert(`New Chat Created`);
        window.location.reload(false);
      })
      .catch(err => console.log(err))
      }else{
        alert('Please select a user');
      }
    
  }


  const deleteNow = () => {
    const rawId = localStorage.getItem('selectedDel');
    console.log(rawId);
    const id = rawId.replace(/^"(.*)"$/, '$1'); //removes double quotes from a string 
    axios.delete(`api/chats/${id}`)
    .then(res => {
      console.log(res)
      alert(res.data)
      setIsChatId(false);
      retrieveUsersChats()
    })
  }




//Almighty pusher-useEffect function...the main engine for the messaging system
  useEffect(() =>{
    const pusher = new Pusher('0d81b56dcdff3b8a813c', {
      cluster: 'mt1'
    });

    const messageChannel = pusher.subscribe('messages');
    const chatChannel = pusher.subscribe('chats');

    messageChannel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);
      console.log(newMessage)
      const myId = user.sub;
      console.log(myId)
      console.log(newMessage.id);
      if(newMessage.id !== myId){
        setMessageMine();
      }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Sidebar isChatId={isChatId} setIsChatId={setIsChatId} unblockUser={unblockUser} chatsExist={chatsExist} setChatsExist={setChatsExist} chatRejuvinate={chatRejuvinate}  retrieveUsersChats={retrieveUsersChats}  blockUser={blockUser} chats={chats} user={user} show={show} setShow={setShow} addNewChat={addNewChat} fetchChat={fetchChat} contactlist={contactlist} deleteNow={deleteNow} gotId={gotId} setGotId={setGotId} />
                <Chat messageMine={messageMine} isChatId={isChatId} setIsChatId={setIsChatId} chatId={chatId} setChatId={setChatId} chatRejuvinate={chatRejuvinate} currentChat={currentChat} messages={messages} user={user} chats={chats} setMessages={setMessages} fetchChat={fetchChat} />
                
              </ProtectedRoute>
              
            </Switch>
        
      </div>

    </div>  
    
  ):(
      <Login />
  )}

export default App;
