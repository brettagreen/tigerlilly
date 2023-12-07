import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "./userContext";
import TigerlillyApi from './api';

function Signup({ updateUserToken }) {

    const INITIAL_STATE = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        icon: null
      }

    const setCurrentUser = useContext(UserContext).setCurrentUser;

    const [form, setForm] = useState(INITIAL_STATE);
    const invalidFields = useRef();
    const history = useNavigate();

    function handleChange(event) {
        if (event.target.name === "icon") {
            if (event.target.files[0].size > 1000000) return alert("choose a smaller file");
            setForm({...form, [event.target.name]: event.target.files[0]});
        } else {
            setForm({...form, [event.target.name]: event.target.value});
        }
    }

    async function submitAndClear(event) {
        event.preventDefault();
        let error = false;

        let allAnswered = Object.values(form).every(item => {
            return item !== '';
        });

        if (!allAnswered) {
            error = true;
            invalidFields.current.hidden = false;
        }

        if (!error) {
            const userToken = await TigerlillyApi.registerUser(form);
            TigerlillyApi.token = userToken.token;
            updateUserToken(userToken.token);
            setCurrentUser(form.username)
            setForm(INITIAL_STATE);
            history('/profile');
        }

    }

    return (
        <>
            <h3 className="textInfo">Resigter your account</h3>
            <h5 hidden style={{color: 'red'}} ref={invalidFields}>All fields must contain a value!</h5>
            
            <form className="form" encType="multipart/form-data" onSubmit={submitAndClear}>
                <label htmlFor="username">username:  </label>
                <input type="text" id="username" name="username" onChange={handleChange} /><br /><br />
                <label htmlFor="password">password: </label>
                <input type="password" id="password" name="password" onChange={handleChange} 
                    placeholder="password must be at least 8 characters long and contain at least
                                 1 capital letter, 1 number, and 1 special character e.g. @&!* etc."/><br /><br />
                <label htmlFor="confirmPassword">confirm password: </label>
                <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} /><br /><br />
                <label htmlFor="firstName">first name: </label>
                <input type="text" id="firstName" name="firstName" onChange={handleChange} /><br /><br />
                <label htmlFor="lastName">last name: </label>
                <input type="text" id="lastName" name="lastName" onChange={handleChange} /><br /><br />
                <label htmlFor="email">email: </label>
                <input type="email" id="email" name="email" onChange={handleChange} /><br /><br />
                <label htmlFor="icon">icon: </label>
                <input type="file" id="icon" name="icon" onChange={handleChange} /><br /><br />
                <button>submit</button>
            </form>
        </>
    )

}

export default Signup;