import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import React from 'react';

function Chat() {
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
                <p>
                    this is a message
                </p>
            </div>
            
        </div>
    )
}

export default Chat
