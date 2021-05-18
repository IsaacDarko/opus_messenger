import React from 'react';
import { useEffect, useState } from 'react';
import '../Styles/Sidebar.css';
import '../Styles/SidebarChat.css'
import { Avatar,IconButton } from '@material-ui/core';
import  ChatIcon from '@material-ui/icons/Chat';
import  SearchOutlined from '@material-ui/icons/SearchOutlined';
import  MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';


function Sidebar({ setShow, chats, fetchChat, addNewChat, blockUser, retrieveUsersChats, deleteNow }) {
    const [chatid, setChatid] = useState('');
    const [ currUserId, setCurrUserId ] = useState('');
    const [ currUserName, setCurrUserName ] = useState('');
    const [ currUserDisp, setCurrUserDisp ] = useState('');
    const [ currUserMail, setCurrUserMail ] = useState('');
    const [ isChatId, setIsChatId ] = useState();

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    const { picture } = user;

    const unlock = () =>{
        if( chats === [] || chats === undefined ){
            setIsChatId(false);
            console.log('Sidebar Unlock Failed...No chats exist in this account')
        }else{
            setIsChatId(true);
            console.log('Sidebar Unlock Successful')
        }
    }

    const signalModal = () => {
        setShow(true);
        addNewChat()
    }

    useEffect(() =>{
        unlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const secureChatId = (() => {
        const prevChatId = localStorage.getItem('chatid');
        console.log(prevChatId);
        const currChatId = chatid;
        console.log(currChatId);
        localStorage.removeItem('chatid');
        const interrim = localStorage.getItem('chatid ');
        console.log(interrim);
        localStorage.setItem('chatid', JSON.stringify(currChatId));
        const localChatId = localStorage.getItem('chatid');
        console.log(localChatId)
        console.log(`saved ${chatid} to localStorage`);
        fetchChat(); 
        
        const currentUser = {
            userid: currUserId,
            name: currUserName,
            displayname: currUserDisp,
            mail: currUserMail
        };

        const current = localStorage.setItem('currentUser', JSON.stringify(currentUser))  
        console.log(current);
    })







    return !isChatId ? (

        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton >
                        <ChatIcon onClick={() => signalModal()} />
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

    ) : (

        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={picture}/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <ChatIcon onClick={() => signalModal()} />
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
                <div className="sidebarChat" key={ chat._id } value={chatid} id={chat._id} onClick={ (e) => {                
                    setChatid(e.target.id);
                    setCurrUserId(chat.recpt_id)
                    setCurrUserName(chat.recpt_name)
                    setCurrUserDisp(chat.recptdispName)
                    setCurrUserMail(chat.recpt_mail)
                    setTimeout(secureChatId(),5000);
                }}>
            
                    <div className="sidebarChat__left">
                        <Avatar src={`${chat.recptdispPic}`}/>
                    </div>
                    
                    <div className="sidebarChat__info">
                        <h2>{chat.recptdispName}</h2>
                        <p>{chat.recpt_mail}</p>
                    </div>

                    <div className="sidebarChat__right">
                            <span className="chat__trash" ><DeleteIcon onClick={ () => {
                            
                            }}  
                            /></span> 
                            <span className="chat__block"> <BlockIcon onClick={() =>  blockUser} /> </span>
                    </div> 
                    
                </div>
            ))}   
            </div>
        </div>
        
    )
}

export default Sidebar
