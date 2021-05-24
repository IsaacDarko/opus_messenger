import { useState, useEffect } from 'react';
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
    const { chatRejuvinate } = props;
    const {currentChat} = props;
    const { picture, name, last_login } = currentChat[0]
    console.log(currentChat[0]);
    const { messages } = props;
    const { user } = useAuth0();
    console.log(user);
    console.log(messages);
    const [input, setInput] = useState("");
    const [ currRecpt, setCurrRecpt ] = useState({});
    const [ isChatId, setIsChatId ] = useState();
    const chatid = localStorage.getItem('chatId');


    const unlock = () =>{
        if(chatid === "" || chatid === undefined){
            setIsChatId(false);
            console.log('ChatPage Unlock Failed...No chats exist in this account')
        }else{
            setIsChatId(true);
            console.log('ChatPage Unlock Successful')
        }
    }


    const sendMessage = (e) => {
        e.preventDefault(); 
        const chatid = localStorage.getItem('chatid');
        const specialkey= localStorage.getItem('chatSpecialKey');
        const details = JSON.parse(localStorage.getItem('currentUser'));
        console.log(details);
        console.log(details.displayname);
        console.log(chatid);
        if (chatid !== null || chatid !== ''){
            axios.post('/api/messages', {
                chatid: chatid,            
                message: input,
                name:user.name,
                senderid:user.sub,
                sndrsdispname:user.nickname,
                receivername:details.name,
                receiverspic: details.pic,
                receiverdispname:details.displayname,
                chatSpecialKey: specialkey
                
            }).then( response =>{
                setInput("");
            })
            .catch(err => console.log(err))

        } else{
            alert("Please select an existing chat or start a new one before sending a message")
        }
    }


    useEffect(() =>{
        unlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
        const current = JSON.parse(localStorage.getItem('currentUser'));
        console.log(current.picture);
        setCurrRecpt(current);
    }, []);



    return !isChatId ? (
                <div className="chat">
                    <div className="chat__header">
                        <Avatar />

                        <div className="chat__headerInfo">
                            <h3>Name</h3>
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
                                alert('You need to select a chat first before sending a message')
                                }
                                } type="submit"><SendIcon/></button>
                        </form>
                    </div>

            </div>

    ):(
                <div className="chat">

                    <div className="chat__header">
                        <Avatar src={picture} />

                        <div className="chat__headerInfo">
                            <h3>{name}</h3>
                            <p><h5>Last Seen: </h5>{last_login}....</p>
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
                                <p className={`chat__message ${user.name !== message.receivername && 'sender__myself'}`}>
                                    <span className="chat__name">{message.name}</span>
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
