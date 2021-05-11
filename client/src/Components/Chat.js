import { useState } from 'react';
import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import React from 'react';
import axios from '../axios';
import LogoutButton from './LogoutButton';

function Chat({ messages, user }) { 
    const [input, setInput] = useState("");
    console.log(messages)
    const sendMessage = (e) => { 
        e.preventDefault();
        axios.post('/api/messages', {
            usermessage: input,
            username: user.name ,
            userid:user.email,
            chatid:"6099e759c2fc4a3398bf69c8",
            sent: true
        });
        setInput("");
    }


    return (
        
        <div className="chat">

            <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>Contact Name</h3>
                    <p>Last Seen Online....</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                      
                    </IconButton>
                    <LogoutButton /> 
                </div>
            </div>


            <div className="chat__body">
                {messages.map((message) => (
                    <div className="message__container">
                        <p className={`chat__message ${message.sent === true && 'sender__myself'}`}>
                            <span className="chat__name">{message.username}</span>
                                {message.usermessage}
                            <span className="chat__timestamp">
                                { message.timestamp }
                            </span>
                        </p>                        
                    </div>
                ))}
                
            </div>


            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e => 
                    setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send Message</button>
                </form>
            </div>
            
        </div>
    )
}

export default Chat
