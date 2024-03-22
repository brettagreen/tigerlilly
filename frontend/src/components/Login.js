//typedefs
/**
 * @typedef {Object} user - returned user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/
/**
 * @typedef {Object} form - login form
 * @property {string} username username
 * @property {string} password password
 */

import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField, Button, ThemeProvider, InputAdornment, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TigerlillyApi from '../api';
import UserContext from '../userContext';
import { formTheme } from '../css/styles';

/**
 * @component /frontend/src/components/Login
 * @requires module:react.useState
 * @requires module:react.useContext
 * @requires module:react.useEffect
 * @requires module:react-router-dom.useNavigate
 * @requires module:mui/material/FormControl
 * @requires module:mui/material/TextField
 * @requires module:mui/material/Button
 * @requires module:mui/material/ThemeProvider
 * @requires module:mui/material/InputAdornment
 * @requires module:mui/material/IconButton
 * @requires module:mui/icons-material/VisibilityOutlined
 * @requires module:mui/icons-material/VisibilityOff
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/userContext
 * @requires module:/frontend/src/css/styles.formTheme
 * 
 * @description Login component. presents basic form for logging into the site
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {function} updateUserToken if login attempt is successful, this function will set the user's auth token in the App component
 * @returns {JSX.Element} - <form> for logging in
 *
 */
function Login({ updateUserToken }) {

    /**
     * grab user object from useContext. this value is subsequently used to determined if the person logging in is already logged in.
     * @type {user}
     */
    const loggedIn = useContext(UserContext).user;

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    useEffect(() => {
        console.log('alreadyLoggedIn() useEffect');
        /**
         * if user tries to access this page when they are already logged in, then they will be redirected to Redirects component
         * @returns {undefined}
         */
        function alreadyLoggedIn() {
            if (loggedIn) {
                history(`/badrequest/alreadyLoggedIn}`);
            }
        }
        alreadyLoggedIn();

    }, [history, loggedIn]);

    /**
     * establish form object
     */
    const INITIAL_STATE = {
        username: '',
        password: ''
    }

    /**
     * @typedef {Object} controlShow1 - useState hook. if show1 val == true, then user can see the value of the form's password field.
     * @property {boolean} show1 - true/false show in plaintext 'password' field text. defaults to false.
     * @property {function} setShow1 - set whether 'password' plaintext is shown or not
     */
    /**
     * @type {controlShow1}
     */
    const [show1, setShow1] = useState(false);

    /**
     * eyeball icon appended to end of 'password' field. on hover action, password plaintext value will be shown, otherwise it won't
     */
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow1(true)}
                        onMouseLeave={() => setShow1(false)}>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    /**
     * function that can set the global user object upon successful login
     * @type {function}
     */
    const setCurrentUser = useContext(UserContext).setCurrentUser;

    /**
     * @typedef {Object} controlForm - useState hook. form object properties: username and password
     * @property {INITIAL_STATE} form - form
     * @property {function} setForm - set form object
     */
    /**
     * @type {controlForm}
     */
    const [form, setForm] = useState(INITIAL_STATE);

    /**
     * @typedef {Object} controlError - useState hook. is true when there is an error with the form submission
     * @property {boolean} error - is there an error with the form?
     * @property {function} setError - set whether there is an error with the form
     */
    /**
     * @type {controlError}
     */
    const [error, setError] = useState(null);

    /**
     * sets form property value based on user's form input
     * @param {Object} event 
     * @returns {undefined}
     */
    function handleChange(event) {
        setForm({...form, [event.target.name]: event.target.value});
    }

    /**
     * does some basic form validation and sets error value = true if there is an error
     * otherwise, submits form
     * @param {Object} event
     * @async
     * @returns {undefined}
     */
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
            <div className="PageHeader">
                <h3>Log in to your account</h3>
            </div>

            <ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper">
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
                </div>
            </ThemeProvider>
            {error ? <h1>{error} please try again.</h1> : null}
        </>
    )

}

export default Login;