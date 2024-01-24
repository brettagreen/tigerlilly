import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TigerlillyApi from './api';
import UserContext from './userContext';
import {FormControl, TextField, InputLabel, Button} from '@mui/material';

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
        setForm({...form, [event.target.name]: event.target.value});
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
            <FormControl className="form" onSubmit={submitAndClear}>
                <InputLabel htmlFor="username">username: </InputLabel>
                <TextField type="text" id="username" name="username" onChange={handleChange} /><br /><br />
                <InputLabel htmlFor="password">password: </InputLabel>
                <TextField type="password" id="password" name="password" onChange={handleChange} /><br /><br />
                <Button className="SubmitButton" type="submit" variant="outlined" size="small" sx={{backgroundColor: '#f3f2f2',
                        color: '#171515', borderColor: '#171515', marginTop: '2em'}}>Submit</Button>
            </FormControl>
            {error ? <h1>{error} please try again.</h1> : null}
        </>
    )

}

export default Login;