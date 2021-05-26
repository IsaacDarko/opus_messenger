import React from 'react';
import { Avatar } from '@material-ui/core';
import { useState, useEffect } from 'react';
import '../Styles/StartChatModal.css';
import { useAuth0 } from "@auth0/auth0-react";

const StartChatModal = (props) => {
    const {
        chats,
        contactlist,
        selectUser
    } = props;

    const { user } = useAuth0();


    const [ recptId, setRecptId ] = useState('');
    const [ recptName, setRecptName ] = useState('');
    const [ recptMail, setRecptMail ] = useState('');
    const [ dispName, setdispName ] = useState('');
    const [ dispPic, setdispPic ] = useState('');

    
    const [ selectedUser, setSelectedUser ] = useState({});
    const toggle = () => {
        props.switchOff();
    }


    const secureContactDeets = () => {
        console.log("starting secure deets");
        const reciepient = {
            'recpt_id' : recptId,
            'recpt_name' : recptName,
            'sndrs_id' : user.sub,
            'sndrs_name' : user.name,
            'recpt_mail' : recptMail,
            'sndrs_mail' : user.email,
            'recptdispName' : dispName,
            'recptPicture' : dispPic,
            'sndrsdispName':user.nickname,
            'sndrsPicture':user.picture,
            'secretKey':"'on its way",
            'last_mesge' : "",
            'numofmsges' : 0
        }
        console.log(reciepient);
        setSelectedUser(reciepient);
        console.log(selectedUser);
        const prevSelectedUser = localStorage.getItem('selectedUser')
        console.log(`this is the previous saved user: ${prevSelectedUser}`)
        localStorage.removeItem('selectedUser')
        localStorage.setItem('selectedUser', JSON.stringify(reciepient));
        selectUser()
    }


    useEffect(()=>{
        // eslint-disable-next-line no-mixed-operators
        if( chats !== undefined || recptId !== '' && recptName !== '' && recptMail !== '' && dispName !== '' ){
            secureContactDeets();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[recptId, recptName, recptMail, dispName])

    
    return props.show ? (
        
            <div className="modal__wrapper" onClick={ () => toggle() }>
                <div className="modal__inner">
                    <div className="modal__body" style={{zIndex:1}}>
                        { contactlist.map((contact) =>  (                        
                            <div className="user__select" key={ contact.user_id } onClick={() => {      
                                    setRecptId(`${contact.user_id}`);
                                    setRecptMail(`${contact.email}`);
                                    setRecptName(`${contact.name}`);
                                    setdispName(`${contact.nickname}`);    
                                    setdispPic(`${contact.picture}`);
                                }}>
                                <Avatar src={`${contact.picture}`} />
                                <span>
                                    ${contact.name}
                                </span>
                            </div>                   
                        )
                        )}
                    </div>
                </div>
            </div>

    ):(
        null
    )
}

export default StartChatModal
