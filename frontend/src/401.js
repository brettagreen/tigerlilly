import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Error() {

    const history = useNavigate();
    const { type } = useParams();

    function msg() {
        if (type === "noProfile") {
            return <h1 className="textInfo">You must be logged in to view your profile.</h1>

        } else if (type === 'notAdmin') {
            return <h1 className="textInfo">Are you an admin??? Didn't think so!</h1>
            
        } else if (type === 'noPage') {
            return <h1 className="textInfo">The page you're looking for does not exist.</h1>

        } else { //type === 'alreadyLoggedIn'
            return <h1 className="textInfo">You are already logged in. To log out, click your user icon on the toolbar.</h1>
        }
    }

    useEffect(() => {
        setTimeout(() => {
            history('/');
        }, 3000);
    }, [history]);

    return (
        <>
            {msg()}
        </>
    )
}

export default Error;