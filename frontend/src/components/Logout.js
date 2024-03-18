import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TigerlillyApi from '../api';
import UserContext from '../userContext';

function Logout({ updateUserToken }) {

    const history = useNavigate();
    const setCurrentUser = useContext(UserContext).setCurrentUser;
    
    useEffect(() => {
        TigerlillyApi.token = '';
        updateUserToken(null);
        setCurrentUser(null);
        history('/');
    }, [updateUserToken, setCurrentUser, history]);

}

export default Logout;