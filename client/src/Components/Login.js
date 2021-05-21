import React from 'react';
import LoginButton from './login-button';
import SignupButton from './signup-button';
import '../Styles/LoginButton.css';
import '../Styles/Login.css'

function Login() {
    return (
        <div className="login__body">
            <div className="login__inner">
                <div className="login__header">
                    <h4>Welcome To Opus Messenger</h4>
                </div>
                <div className="login__button">
                    <LoginButton />
                </div>
                <div className="signup__button">
                    <SignupButton />
                </div>       
            </div>
        </div>
    )
}

export default Login
