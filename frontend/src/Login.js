import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TigerlillyApi from './api';
import UserContext from './userContext';
import { FormControl, TextField, Button, Box, ThemeProvider, InputAdornment, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formTheme } from './css/styles';

function Login({ updateUserToken }) {

    const loggedIn = useContext(UserContext).user;
    const history = useNavigate();

    useEffect(() => {
        console.log('alreadyLoggedIn() useEffect');
        function alreadyLoggedIn() {
            if (loggedIn) {
                history(`/badrequest/alreadyLoggedIn}`);
            }
        }
        alreadyLoggedIn();

    }, [history, loggedIn]);

    const INITIAL_STATE = {
        username: '',
        password: ''
    }

    const [show1, setShow1] = useState(false);
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow1(true)}
                        onMouseLeave={() => setShow1(false)}>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    const setCurrentUser = useContext(UserContext).setCurrentUser;

    const [form, setForm] = useState(INITIAL_STATE);
    const [error, setError] = useState(null);

    function handleChange(event) {
        setForm({...form, [event.target.name]: event.target.value});
    }

    async function submitAndClear(event) {
        event.preventDefault();

        const allAnswered = Object.values(form).every(item => {
            return item !== '';
        });

        if (allAnswered) {
            try {
                const user = await TigerlillyApi.loginUser(form);
                updateUserToken(user.token);
                setCurrentUser(user.user);
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
            <h2 className="textInfo">Log in to your account</h2>

            <ThemeProvider theme={formTheme}>
                <div className="FormWrapper">
                    <Box className="BackdropBox" component="section">
                        <form id="loginForm" autoComplete="off" encType="multipart/form-data" onSubmit={submitAndClear}> 
                            <FormControl margin="normal">
                                <TextField type="text" label="username" name="username" variant="outlined" onChange={handleChange }
                                        value={form.username} sx={{marginBottom: '.5em'}} />
                                <TextField type={show1?"text":"password"} label="password" name="password" value={form.password} onChange={handleChange}
                                            InputProps={pwIcon1} />
                                <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: '#f3f2f2',
                                        color: '#171515', fontSize: '.6em', borderColor: '#171515', marginTop: '2em',
                                        fontVariant: 'small-caps'}}
                                >Submit</Button>
                            </FormControl>
                        </form>
                    </Box>
                </div>
            </ThemeProvider>
            {error ? <h1>{error} please try again.</h1> : null}
        </>
    )

}

export default Login;