import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TigerlillyApi from './api';
import UserContext from './userContext';

function Login({ updateUserToken }) {

    const INITIAL_STATE = {
        username: '',
        password: ''
    }

    const setCurrentUser = useContext(UserContext).setCurrentUser;

    const [form, setForm] = useState(INITIAL_STATE);
    const [error, setError] = useState(null);

    const history = useNavigate();

    function handleChange(event) {
        setForm(form => ({...form, [event.target.name]: event.target.value}));
    }

    async function submitAndClear(event) {
        event.preventDefault();

        let allAnswered = Object.values(form).every(item => {
            return item !== '';
        });

        if (allAnswered) {
            try {
                const userToken = await TigerlillyApi.loginUser(form);
                updateUserToken(userToken.token);
                setCurrentUser(form.username);
                setForm(INITIAL_STATE);
                history('/');
            } catch (error) {
                setError(error);
                setForm(INITIAL_STATE);
            }
        }

    }

    return (
        <>
            <h3 className="textInfo">Account login</h3>
            <form className="form" onSubmit={submitAndClear}>
                <label htmlFor="username">username: </label>
                <input type="text" id="username" name="username" onChange={handleChange} /><br /><br />
                <label htmlFor="password">password: </label>
                <input type="password" id="password" name="password" onChange={handleChange} /><br /><br />
                <button>submit</button>
            </form>
            {error ? <h1>{error} please try again.</h1> : null}
        </>
    )

}

export default Login;