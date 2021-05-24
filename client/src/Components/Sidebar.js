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


function Sidebar({ setShow, chats, fetchChat, addNewChat, blockUser, chatRejuvinate, retrieveUsersChats, deleteNow }) {
//declaring state holders for the selectchat function variables
    const [chatid, setChatid] = useState('');
    const [ currUserId, setCurrUserId ] = useState('');
    const [ currUserName, setCurrUserName ] = useState('');
    const [ currUserDisp, setCurrUserDisp ] = useState('');
    const [ currUserMail, setCurrUserMail ] = useState('');
    const [ isChatId, setIsChatId ] = useState();
    const [ chatSpecialKey, setChatSpecialKey ] = useState('');
    const [ currentUserPic,setCurrentUserPic ] = useState('');

//declaring state holders for the block url trigger function variables
    const [blockerId, setBlockerId] = useState('');
    const [blockeeId, setBlockeeId] = useState('');
    const [blockername, setBlockername] = useState('');
    const [blockeename, setBlockeename] = useState('');
    const [blockermail, setBlockermail] = useState('')
    const [blockeemail, setBlockeemail] = useState('')
    const [blockerDispName, setBlockerDispName] = useState('')
    const [blockeeDispName, setBlockeeDispName] = useState('')

//declaring state holders for the delete callback function variables
    const [ selectedId, setSelectedId ] = useState('');
    const [ deleteClicked, setDeleteClicked ] = useState(false)

//declaring state holders for the block callback function variables
    const [ blockClicked, setBlockClicked ] = useState(false);
    
//destructuring the valid users details from the Auth0 hook and saving to variable "user"
    const { user } = useAuth0();
    const { picture } = user;

    console.log(user);

//useEffect for selecting a particular chat
    useEffect(()=>{
        secureChatId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentUserPic])

//function for triggering the url call to delete a chat
    const acquireTarget = () => {
        console.log(selectedId);
        // eslint-disable-next-line no-unused-vars
        const endangeredItem = localStorage.setItem('selectedDel', JSON.stringify(selectedId));
        const checker = localStorage.getItem('selectedDel');
        console.log(checker);
        console.log('delete function run without being called again')
        deleteNow();
        setDeleteClicked(false);
    }


//function for triggering the url call to block a user from the sidebar chat elements
    const acquireExile = (e) => {

        const blockCert = {
            blocker_id: blockerId,
            blocker_name: blockername,
            blockee_id: blockeeId,
            blockee_name: blockeename,
            blocker_mail: blockermail,
            blockee_mail: blockeemail,
            blocker_dispName: blockerDispName,
            blockee_dispName: blockeeDispName   
        }
        console.log(blockCert);
        const endangeredItem = localStorage.setItem('selectedBlock', JSON.stringify(blockCert));
        console.log(endangeredItem);
        blockUser()
    }

//function to unlock the sidebar is user is validated
    const unlock = () =>{
        if( chats === [] || chats === undefined ){
            setIsChatId(false);
            console.log('Sidebar Unlock Failed...No chats exist in this account')
        }else{
            setIsChatId(true);
            console.log('Sidebar Unlock Successful')
        }
    }

//function to open modal to start a new chat
    const signalModal = () => {
        setShow(true);
        addNewChat()
    }

//useEffect to trigger unlocking the sidebar if user is validated
    useEffect(() =>{
        unlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



//useEffect to trigger the entire delete sequence when the delete button is clicked
    useEffect(() =>{
        if(deleteClicked === true){
            console.log(selectedId)
            acquireTarget();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteClicked]);


//useEffect to trigger the blockuser sequence when the block button is clicked
    useEffect(() =>{
        if(blockClicked === true){
            const doomedItem = JSON.parse(localStorage.getItem('selectedBlock'));
            console.log(doomedItem);
            acquireExile();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockClicked]);



//secure chatid function which begins the entire add-new-chat sequence and sets up new chats for both user and receiver
    const secureChatId = (() => {
        console.log(chats)
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
        const current = localStorage.setItem('currentUser', JSON.stringify(currentUser));
        const checker = localStorage.getItem('chatid');
        const checker2 = localStorage.getItem('chatSecretKey');
        console.log(currentUser);
        console.log(`chatid: ${checker}, specialkey: ${checker2}`);

        
        fetchChat(); 
        chatRejuvinate()

    })//where sidebar makes the current receiver's details accessible to all other components






//Render Sidebar
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
                <div className="sidebarChat" key={ chat._id } value={chatid} id={chat._id}>
            
                    <div className="sidebarChat__left">
                        <Avatar src={`${chat.recptdispPic}`}/>
                    </div>
                    
                    <div className="sidebarChat__info" onClick={ (e) => {                
                    setChatid(chat._id)
                    setCurrUserId(chat.recpt_id)
                    setCurrUserName(chat.recpt_name)
                    setCurrUserDisp(chat.recptdispName)
                    setCurrUserMail(chat.recpt_mail)
                    setChatSpecialKey(chat.specialkey)
                    setCurrentUserPic(chat.recptdispPic)
                }}>
                        <h2>{chat.recptdispName}</h2>
                        <p>{chat.recpt_mail}</p>
                    </div>

                    <div className="sidebarChat__right">
                            <span value={selectedId} id={chat.specialkey} className="chat__trash" ><DeleteIcon onClick={(e) => {
                                console.log(chat.specialkey)
                                setSelectedId(chat.specialkey);
                                setDeleteClicked(true)
                                }}/></span> 

                            <span id={chat._id} className="chat__block"> <BlockIcon onClick={(e) => {
                                console.log(`this is the id of who you just blocked: ${chat.recpt_id}`);
                                //prepping state to fire block function
                                setBlockerId(chat.sndrs_id)
                                setBlockeeId(chat.recpt_id)
                                setBlockername(chat.sndrs_name)
                                setBlockeename(chat.recpt_name)
                                setBlockermail(chat.sndrs_mail)
                                setBlockeemail(chat.recpt_mail)
                                setBlockerDispName(chat.sndrsdispName)
                                setBlockeeDispName(chat.recptdispName)
                                setBlockClicked(true)
                                }} /> </span>
                    </div> 
                    
                </div>
            ))}   
            </div>
        </div>
        
    )
}

export default Sidebar
