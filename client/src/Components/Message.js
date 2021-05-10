import React from 'react';
import '../Styles/Chat.css';

function Message() {
    return (
        <div className="message__container">
            <p className={`chat__message ${true && 'sender__myself'}`}>
                <span className="chat__name">Sender</span>
                    this is a message
                <span className="chat__timestamp">
                    { new Date().toUTCString() }
                </span>
            </p>
            
        </div>
    )
}

export default Message
