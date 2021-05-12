import { useState } from 'react';
import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import React from 'react';
import axios from '../axios';
import AuthNav from './auth-nav';
import Loading from './Loading';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function Chat({ messages, chatId }) { 
    const { user } = useAuth0();
    const { name, sub } = user;

    const [input, setInput] = useState("");

    console.log(messages);

    const sendMessage = (e) => { 
        e.preventDefault();
        axios.post('/api/messages', {
            usermessage: input,
            username:name ,
            userid: sub,
            chatid:"6099e759c2fc4a3398bf69c8",
            sent: true
        });
        setInput("");
    }


    return chatId ? (
        
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
                    <AuthNav />
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
    ):(

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
                    <AuthNav />
                </div>
                
            </div>


            <div className="chat__body">
                <h4>Select an existing conversation or start A New on</h4>
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

export default withAuthenticationRequired(Chat, {
    onRedirecting: () => <Loading />,
  });
