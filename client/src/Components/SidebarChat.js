import { useEffect, useState } from 'react'
import '../Styles/SidebarChat.css'
import { Avatar } from '@material-ui/core'
import React from 'react'


function SidebarChat() {
    const [seed, setSeed] = useState('');

    useEffect(() =>{
        setSeed(Math.floor(Math.random()*5000));
    }, [])

    return (
        <div className="sidebarChat">
            <div className="sidebarChat__left">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
            </div>
            
            <div className="sidebarChat__info">
                <h2>Contact Name</h2>
                <p>Their most recent message</p>
            </div>
            
        </div>
    )
}

export default SidebarChat
