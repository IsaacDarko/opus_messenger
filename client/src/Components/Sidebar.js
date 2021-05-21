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
import { useAuth0 } from '@auth0/auth0-react'


function Sidebar({ setShow, chats, fetchChat, addNewChat, blockUser, retrieveUsersChats, deleteNow }) {
    const [chatid, setChatid] = useState('');
    const [ currUserId, setCurrUserId ] = useState('');
    const [ currUserName, setCurrUserName ] = useState('');
    const [ currUserDisp, setCurrUserDisp ] = useState('');
    const [ currUserMail, setCurrUserMail ] = useState('');
    const [ isChatId, setIsChatId ] = useState();
    const [ chatSpecialKey, setChatSpecialKey ] = useState('');
    const [ currentUserPic,setCurrentUserPic ] = useState('');
    const [ selectedId, setSelectedId ] = useState('');
    const [ doomedId, setDoomedId ] = useState('')
    const { user } = useAuth0();
    console.log(user);
    const { picture } = user;


    useEffect(()=>{
        secureChatId()
    },[currentUserPic])


    const acquireTarget = () => {
        const endangeredItem = localStorage.setItem('selectedDel', JSON.stringify(selectedId));
        console.log(endangeredItem);
        deleteNow()
    }



    const acquireExile = () => {
        const endangeredItem = localStorage.setItem('selectedBlock', JSON.stringify(doomedId));
        console.log(endangeredItem);
        blockUser()
    }


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
        const currChatId = localStorage.setItem('chatid', JSON.stringify(chatid));
        const csk = localStorage.setItem('chatSpecialKey', JSON.stringify(chatSpecialKey));
        const currentChatId = localStorage.getItem('chatid');
        console.log(currentChatId);
        const currentUser = {
            userid: currUserId,
            name: currUserName,
            displayname: currUserDisp,
            mail: currUserMail,
            chatspecialkey: csk,
            picture: currentUserPic
        };
        const current = localStorage.setItem('currentUser', JSON.stringify(currentUser)) 
        const checker = localStorage.getItem('chatid');
        const checker2 = localStorage.getItem('chatSecretKey');
        console.log(currentUser);
        console.log(`chatid: ${checker}, specialkey: ${checker2}`);

        
        fetchChat(); 

    })//where sidebar makes the current receiver's details accessible to all other components







    return !isChatId ? (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={picture} />
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
                <Avatar src={picture} />
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
                    setChatid(chat._id)
                    setCurrUserId(chat._id)
                    setCurrUserName(chat.recpt_name)
                    setCurrUserDisp(chat.recptdispName)
                    setCurrUserMail(chat.recpt_mail)
                    setChatSpecialKey(chat.specialkey)
                    setCurrentUserPic(chat.recptdispPic)
                }}>
            
                    <div className="sidebarChat__left">
                        <Avatar src={`${chat.recptdispPic}`}/>
                    </div>
                    
                    <div className="sidebarChat__info">
                        <h2>{chat.recptdispName}</h2>
                        <p>{chat.recpt_mail}</p>
                    </div>

                    <div className="sidebarChat__right">
                            <span id={chat.specialkey} className="chat__trash" ><DeleteIcon onClick={(e) => {
                                setSelectedId(e.target.id)
                                acquireTarget()
                                }}/></span> 

                            <span id={chat._id} className="chat__block"> <BlockIcon onClick={(e) => {
                                setDoomedId(e.target.id)                                
                                acquireExile()
                                }} /> </span>
                    </div> 
                    
                </div>
            ))}   
            </div>
        </div>
        
    )
}

export default Sidebar
