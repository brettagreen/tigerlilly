import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TigerlillyApi from '../api';
import UserContext from '../userContext';

/**
 * @component /frontend/src/components/Logout
 * @requires module:react.useEffect
 * @requires module:react.useContext
 * @requires module:react-router-dom.useNavigate
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/userContext
 * 
 * @description Logout component. logs user out of the site and redirects user the homepage ('/')
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {function} updateUserToken function updating site's user token (to null) upon successful log out operation
 * @returns {undefined}
 *
 */
function Logout({ updateUserToken }) {

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * function that can set the global user object upon successful login
     * @type {function}
     */
    const setCurrentUser = useContext(UserContext).setCurrentUser;
    
    useEffect(() => {
        TigerlillyApi.token = '';
        updateUserToken(null);
        setCurrentUser(null);
        history('/');
    }, [updateUserToken, setCurrentUser, history]);

}

export default Logout;