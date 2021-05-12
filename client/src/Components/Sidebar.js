import React from 'react';
import { useEffect, useState } from 'react';
import '../Styles/Sidebar.css';
import '../Styles/SidebarChat.css'
import { Avatar,IconButton } from '@material-ui/core';
import  ChatIcon from '@material-ui/icons/Chat';
import  SearchOutlined from '@material-ui/icons/SearchOutlined';
import  MoreVertIcon from '@material-ui/icons/MoreVert';


function Sidebar({ chatId, chats, fetchChat }) {
    const [chatid, setChatid] = useState();
    const [seed, setSeed] = useState('');
    useEffect(() =>{
        setSeed(Math.floor(Math.random()*5000));
    }, []);

    const secureChatId = () => {
        console.log("hover detected");
        const exprtdChatId = localStorage.setItem('chatid', chatid);
        console.log(JSON.stringify(exprtdChatId));
        fetchChat(exprtdChatId);
    }


    const addNewChat = () => {
        const newContact = prompt("Please enter contact name");
        if(newContact) {
            //perform some database magic
        }
    }

    

    return chats ? (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <ChatIcon onClick={ () => addNewChat() } />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                   
                </div>

            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <input placeholder="Search conversations" type="text" />
                </div>
                
            </div>

            <div className="sidebar__chats">
              {chats.map((chat) => (
                <div className="sidebarChat" id={chat._id} onClick={ (e) => {                    
                    setChatid(e.target.id);
                    secureChatId();
                     }
                }>
            
                    <div className="sidebarChat__left">
                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                    </div>
                    
                    <div className="sidebarChat__info">
                        <h2>{chat.disp_name}</h2>
                        <p>{chat.last_msge}</p>
                    </div>
                    
                </div>
              ))}   
            </div>
        </div>
    ) : (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton onClick={addNewChat} >
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                   
                </div>

            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <input placeholder="Search conversations" type="text" />
                </div>
                
            </div>

            <div className="sidebar__chats sidebar__emptyChat">
                <h3 className="empty__message">Click The New Message Icon To Start a New Conversation</h3>
            </div>
        </div>
    )
}

export default Sidebar
