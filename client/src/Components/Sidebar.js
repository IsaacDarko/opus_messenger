import React from 'react';
import '../Styles/Sidebar.css';
import { Avatar,IconButton } from '@material-ui/core';
import  ChatIcon from '@material-ui/icons/Chat';
import  SearchOutlined from '@material-ui/icons/SearchOutlined';

import  MoreVertIcon from '@material-ui/icons/MoreVert';
import SidebarChat from './SidebarChat';


function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <ChatIcon />
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
              <SidebarChat />  
            </div>
        </div>
    )
}

export default Sidebar
