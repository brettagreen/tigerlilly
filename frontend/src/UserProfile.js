import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';

function UserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const res = await TigerlillyApi.getUser(username);
            setUser(res['users']);
        }
        getUser();
    }, [username]);

    return(
        <>
            {user ? 
                <div>
                    <h2>{user.username}</h2>
                    <h4>{user.userFirst} {user.userLast}</h4>
                    <h4>{user.email}</h4>
                    <img src={`/icons/${user.icon}`} height={250} width={250} alt="user icon" />
                </div>
            :null}
        </>
    )
}

export default UserProfile;