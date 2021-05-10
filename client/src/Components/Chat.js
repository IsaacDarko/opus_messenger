import { useState } from 'react';
import Messge from './Message';
import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import React from 'react';

function Chat() { 
    const [input, setInput] = useState("");

   // const addAttachment = () => {
        //execute
    //}

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(`you typed >>> ${input}`);
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
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>


            <div className="chat__body">
               <Messge />
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
