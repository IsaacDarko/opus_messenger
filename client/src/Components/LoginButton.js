import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../Styles/LoginButton.css'; 


function LoginButton() {
    const { loginWithRedirect } = useAuth0();
    return (
        <div className="button__wrapper">
            <button onClick={ ()=> loginWithRedirect() }>
                Log In
            </button>
        </div>
        
    )
}

export default LoginButton
