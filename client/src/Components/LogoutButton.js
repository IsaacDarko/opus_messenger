import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import SettingsPowerIcon from '@material-ui/icons/SettingsPower';


function LogoutButton() {
    const { logout } = useAuth0();
    return (
        <button onClick={ ()=> logout() }>
            <SettingsPowerIcon />
        </button>
    )
}

export default LogoutButton
