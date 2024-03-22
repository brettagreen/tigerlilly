import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * @component /frontend/src/components/Redirects
 * @requires module:react.useEffect
 * @requires module:react-router-dom.useNavigate
 * @requires module:react-router-dom.useParams
 * 
 * @description Redirects component. displays message and then redirects user to their previous page (-1)
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} formatted <h1> error or info related message
 *
 */
function Error() {

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * @typedef {Object} controlParam - key:val object containing any all url passed params. url passed param of type of redirect message
     * to give to user
     * @property {string} type - content of message to be shown to user based on type param
     */
    /**
     * @type {controlParam}
     */
    const { type } = useParams();

    /**
     * returns h1 message string
     * @returns {JSX.Element} <h1>message string</h1>
     */
    function msg() {
        if (type === "noProfile") {
            return <h1>You must be logged in to view your profile.</h1>

        } else if (type === 'notAdmin') {
            return <h1>Are you an admin??? Didn't think so!</h1>
            
        } else if (type === 'noPage') {
            return <h1>The page you're looking for does not exist.</h1>

        } else if (type === 'alreadyLoggedIn') { 
            return <h1>You are already logged in. To log out, click your user icon on the toolbar.</h1>
            
        } else { //successful contact form submission
            return <h1>Thank you! We value your feedback!</h1>
        }
    }

    useEffect(() => {
        setTimeout(() => {
            history(-1);
        }, 3000);
    }, [history]);

    return (
        <div className="PageHeader">
            {msg()}
        </div>
    )
}

export default Error;