import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Error() {

    const history = useNavigate();
    const { type } = useParams();

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
            history('/');
        }, 3000);
    }, [history]);

    return (
        <div className="PageHeader">
            {msg()}
        </div>
    )
}

export default Error;