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
    const { user } = useAuth0();
    const [ chatId, setChatId ] = useState();
    const { currentChat } = props;
    const { isChatId, fetchChat, messageMine } = props;
    const [endPicture, setEndPicture] = useState('');
    const [endName, setEndName] = useState('');
    const [endLastSeen, setEndLastSeen] = useState('')
    const { messages } = props;
    console.log(user);
    console.log(messages);
    const [input, setInput] = useState("");
    

    
    useEffect(() =>{
        console.log(currentChat)
        unlock()
        setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, isChatId]);


    useEffect(() =>{
        setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, endPicture, endName, endLastSeen]);


    useEffect(() =>{
        if(!messageMine){
            fetchChat()
        }else if(messageMine === true){
            fetchChat()
        }else{
            window.location.reload(false);
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageMine]);


    const unlock = () =>{
        console.log(isChatId)
        if( isChatId === false ){
            setChatId()
            console.log('ChatPage Unlock Failed...No chats exist in this account')
        }else{
            setChatId(true);
            console.log('ChatPage Unlock Successful')
        }
    }

    const setup = () =>{
        console.log(chatId);
        if(currentChat === undefined || currentChat === null){
            setEndPicture('')
            setEndName('Name')
            setEndLastSeen('Recently')
        }
        else{           
            const { picture, name, last_login } = currentChat;
            setEndPicture(picture)
            setEndName(name)
            setEndLastSeen(last_login)
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
                console.log(response);
                if(response.status === 208){
                    alert('This User Has Blocked You')
                }else if(response.status === 200){
                    setInput("");
                }else{
                    console.log(`Something's not right the message was not sent`)
                }
            })
            .catch(err => console.log(err))

        } else{
            alert("Please select an existing chat or start a new one before sending a message")
        }
    }





    return !chatId ? (
                <div className="chat">

                    <div className="chat__header">
                        <Avatar />

                        <div className="chat__headerInfo">
                            <h3>Name</h3>
                            <h5>Last Seen: ...</h5>
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
                        <Avatar src={endPicture} />

                        <div className="chat__headerInfo">
                            <h3>{endName}</h3>
                            <p><h5>Last Seen: </h5>{endLastSeen}....</p>
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
