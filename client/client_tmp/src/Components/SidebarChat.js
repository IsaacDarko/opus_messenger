import '../Styles/SidebarChat.css'
import { Avatar } from '@material-ui/core'
import React from 'react'


function SidebarChat() {
    return (
        <div className="sidebarChat">
            <div className="sidebarChat__left">
                <Avatar />
            </div>
            
            <div className="sidebarChat__info">
                <h2>Contact Name</h2>
                <p>Their most recent message</p>
            </div>
            
        </div>
    )
}

export default SidebarChat
