import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './userContext';
import TigerlillyApi from './api';

function User({ isLoggedIn, profileUpdate }) {
    const history = useNavigate();

    if (!isLoggedIn) {
        history('/unauthorizedProfile');
    }

    const user = useContext(UserContext).user;

    const INITIAL_STATE = {
        password: user.password,
        firstName: user.userFirst,
        lastName: user.userLast,
        email: user.email,
        icon: user.icon
    }

    const CLEANUP_STATE = {
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        icon: ''
    }

    const [form, setForm] = useState(INITIAL_STATE);
    const [update, setUpdate] = useState(false);

    function handleChange(event) {
        setForm(form => ({...form, [event.target.name]: event.target.value}))
    }

    async function submitAndClear(event) {
        event.preventDefault();
        setUpdate(false);
        const newUser = await TigerlillyApi.updateProfile(user.username, form);
        profileUpdate(newUser.user);
        setForm(CLEANUP_STATE);

    }

    return (
        <>     
        {update ? <h3>Update your profile</h3> : null}
        <form className="form" onSubmit={submitAndClear}>
            <label htmlFor="username">username: </label>
            <input type="text" className="readOnlyInput" id="username" name="username" value={user.username} readOnly={true} /><br /><br />
            <label htmlFor="password">password: </label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} readOnly={update}
                    placeholder="password must be at least 8 characters long and contain at least 1 capital letter, 1 number, and 1 special character e.g. @&!* etc."/>
            <br /><br />
            <label htmlFor="firstName">first name: </label>
            <input type="text" id="firstName" name="firstName" value={form.userFirst} onChange={handleChange} readOnly={update}/><br /><br />
            <label htmlFor="lastName">last name: </label>
            <input type="text" id="lastName" name="lastName" value={form.userLast} onChange={handleChange} readOnly={update}/><br /><br />
            <label htmlFor="email">email: </label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} readOnly={update}/><br /><br />
            <label htmlFor="icon">icon: </label>
            <input type="url" id="icon" name="icon" value={form.icon} onChange={handleChange} readOnly={update} /><br /><br />
            {update ? <button>submit</button> : <button onClick={setUpdate(true)}>edit profile</button>}
        </form>
        </>
    )

}

export default User;