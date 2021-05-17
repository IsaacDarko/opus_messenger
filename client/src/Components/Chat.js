import { useState } from 'react';
import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import React from 'react';
import axios from '../axios';
import AuthNav from './auth-nav';
import Loading from './Loading';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Chat = (props) => { 
    const { messages, setMessages } = props;
    const { user } = useAuth0();
    const getMyId = localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    const { name, sub } = user;
    console.log(messages);
    const [input, setInput] = useState("");
    const chatid = localStorage.getItem('chatId');


    const sendMessage = (e) => {
        e.preventDefault(); 
        const details = localStorage.getItem('currentUser');
        const { userid, name, displayname, mail } = details;
        console.log(details);
        if (chatid !== null || chatid !== ''){
            console.log(chatid)
            axios.post('/api/messages', {
                chatid: chatid,            
                message: input,
                name:user.name,
                senderid:user.sub,
                sndrsdispname:user.nickname,
                receivername:details.name,
                receiverdispname:details.displayname
                
            }).then( response =>{
                setInput("");
            })
            .catch(err => console.log(err))

        } else{
            alert("Please select an existing chat or start a new one before sending a message")
        }
    }




    return !chatid ? (
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
                        <h4>Select an existing conversation or start A New One</h4>
                    </div>


                    <div className="chat__footer">
                        <InsertEmoticonIcon />
                        <form>
                            <input value={input} onChange={e => 
                            setInput(e.target.value)} placeholder="type a message" type="text" />
                            <button onClick={()=> {                                
                                sendMessage()
                                }
                                } type="submit"><SendIcon/></button>
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
                        {messages.map((message) => (
                            <div className="message__container" key={message._id}>
                                <p className={`chat__message ${user.name === message.sendername && 'sender__myself'}`}>
                                    <span className="chat__name">{message.sendername}</span>
                                        {message.message}
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
                            <button onClick={sendMessage} type="submit"><SendIcon/></button>
                        </form>
                    </div>

                    </div>

    )
}

export default withAuthenticationRequired(Chat, {
    onRedirecting: () => <Loading />,
});
